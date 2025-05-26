import React, { useContext, useReducer, useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { registration } from "../http/userAPI";
import { floatDev } from "../utils/helpers";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { fetchCompanies, fetchDepartments } from "../http/UtilsApi";

const formReducer = (state, action) => {
  if (action.type === 'RESET_FORM') {
    return initialFormData;
  }
  if (action.type === 'ADD_CARD') {
    return {
      ...state,
      cards: [...state.cards, { number: '', shadowNumber: '', pin: '', holder: '', supplier: '' }]
    };
  }
  if (action.type === 'REMOVE_CARD') {
    return {
      ...state,
      cards: state.cards.filter((_, index) => index !== action.index)
    };
  }
  if (action.type === 'UPDATE_CARD') {
    const updatedCards = [...state.cards];
    updatedCards[action.index] = {
      ...updatedCards[action.index],
      [action.field]: action.value
    };
    return {
      ...state,
      cards: updatedCards
    };
  }
  return {
    ...state,
    [action.name]: action.value,
  };
};

const initialFormData = {
  email: "",
  name: "",
  contract: "",
  cost: 0,
  phoneNumber: "",
  discount: 0,
  files: [],
  INN: "",
  role: "driver",
  cards: [],
  ai92: "",
  ai95: "",
  dt: "",
  spbt: "",
  company: "",
  newCompany: "",
  department: "",
  newDepartment: ""
};

const CreateUserPage = () => {
  const [formData, setFormData] = useReducer(
    formReducer,
    initialFormData,
    (val) => val
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const isAdmin = user.user.permissions.role === "admin";

  useEffect(() => {
    fetchCompanies().then(setCompanies).catch((error) => {
      console.error('Error loading data:', error);

    });

    fetchDepartments().then(setDepartments).catch((error) => {
      console.error('Error loading data:', error);

    });
  }, []);
  const filteredDepartments = formData.company
    ? departments.filter(d => d.companyid == formData.company)
    : [];

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setFormData({
      name: 'company',
      value: value
    });
    setFormData({
      name: 'department',
      value: ''
    });
  };

  const handleDepartmentChange = (e) => {
    setFormData({
      name: 'department',
      value: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный email";
    }
    if (!formData.name) {
      newErrors.name = "ФИО";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Номер телефона обязателен";
    }
    if (!formData.INN) {
      newErrors.INN = "ИНН обязателен";
    } else if (!/^\d{10}$|^\d{12}$/.test(formData.INN)) {
      newErrors.INN = "Некорректный ИНН (должно быть 10 или 12 цифр)";
    }
    if (formData.role === 'driver') {
      formData.cards.forEach((card, index) => {
        if (!card.number) {
          newErrors[`card_number_${index}`] = "Номер карты обязателен";
        }
      });
      if (!formData.cost || formData.cost <= 0) {
        newErrors.cost = "Укажите корректную цену контракта";
      }
      if (!formData.contract) {
        newErrors.contract = "Номер договора обязателен";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const submitHandler = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = {
        ...formData,
        cards: Array.isArray(formData.cards) ? formData.cards : [],
        companyId: formData.company,
        departmentId: formData.department,
        newCompany: formData.newCompany,
        newDepartment: formData.newDepartment
      };

      const formDataElement = new FormData();
      for (let key of Object.keys(formData)) {
        if (key === "cards") {
          const cardNumbers = formData.cards.map(card => card.number).join('\n');
          formDataElement.append(key, JSON.stringify(formDataToSend[key]));
        } else {
          formDataElement.append(key, formDataToSend[key]);
        }

      }

      const response = await registration(formDataElement);
      if (response.message) {
        alert("Пользователь успешно создан");
        setFormData({ type: 'RESET_FORM' });
        const url = user.user.permissions.role === "manager" ? '/users/drivers' : '/users'
        navigate(`${url}/${response["userId"]}`)
        setErrors({});
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.response?.data?.message || "Произошла ошибка при регистрации. Пожалуйста, проверьте введенные данные.");
    }
  };

  const handleChange = (event) => {
    setErrors(prev => ({ ...prev, [event.target.name]: "" }));
    setServerError("");
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleNumberChange = (event) => {
    const value = floatDev(event);
    event.target.value = value ? value : null;
    setFormData({
      name: event.target.name,
      value
    });
  };
  const handleCardChange = (index, field, value) => {
    setFormData({
      type: 'UPDATE_CARD',
      index,
      field,
      value
    });
  };
  const addCard = () => {
    setFormData({ type: 'ADD_CARD' });
  };
  const removeCard = (index) => {
    setFormData({ type: 'REMOVE_CARD', index });
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-start"
      style={{
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <Card style={{ width: '100%', maxWidth: '800px' }} className="p-4">
        <h2 className="m-auto mb-4">Создание пользователя</h2>
        {serverError && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center', padding: '10px', backgroundColor: '#ffebee', marginBottom: '10px' }}>
            {serverError}
          </div>
        )}

        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email*</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Введите email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Роль пользователя*</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="driver">Водитель</option>
                  {isAdmin && <option value="manager">Менеджер</option>}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ФИО*</Form.Label>
                <Form.Control
                  placeholder="ФИО"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ИНН*</Form.Label>
                <Form.Control
                  placeholder="ИНН"
                  name="INN"
                  value={formData.INN}
                  onChange={handleChange}
                  isInvalid={!!errors.INN}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.INN}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Номер телефона*</Form.Label>
                <Form.Control
                  placeholder="Номер телефона"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            {formData.role === 'driver' && (

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Договор*</Form.Label>
                  <Form.Control
                    placeholder="Договор"
                    name="contract"
                    value={formData.contract}
                    onChange={handleChange}
                    isInvalid={!!errors.contract}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contract}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}
          </Row>

          {formData.role === 'driver' && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Компания*</Form.Label>
                    <Form.Select
                      name="company"
                      value={formData.company}
                      onChange={handleCompanyChange}
                      required
                    >
                      <option value="">Выберите компанию</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                      <option value="new">+ Добавить новую компанию</option>
                    </Form.Select>
                    {formData.company === 'new' && (
                      <Form.Control
                        className="mt-2"
                        placeholder="Введите название компании"
                        name="newCompany"
                        value={formData.newCompany}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Отдел*</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={handleDepartmentChange}
                      disabled={!formData.company}
                      required
                    >
                      <option value="">Выберите отдел</option>
                      {filteredDepartments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                      <option value="new">+ Добавить новый отдел</option>
                    </Form.Select>
                    {formData.department === 'new' && (
                      <Form.Control
                        className="mt-2"
                        placeholder="Введите название отдела"
                        name="newDepartment"
                        value={formData.newDepartment}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Цена контракта*</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Цена контракта"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      isInvalid={!!errors.cost}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cost}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Скидка (%)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Скидка"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>


              <h5 className="mt-4">Топливные карты</h5>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addCard}
                className="mb-3"
              >
                Добавить карту
              </Button>

              {formData.cards.map((card, index) => (
                <Card key={index} className="mb-3 p-3">
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Номер карты*</Form.Label>
                        <Form.Control
                          placeholder="Номер карты"
                          value={card.number}
                          onChange={(e) => handleCardChange(index, 'number', e.target.value)}
                          isInvalid={!!errors[`card_number_${index}`]}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[`card_number_${index}`]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Shadow номер</Form.Label>
                        <Form.Control
                          placeholder="Shadow номер"
                          value={card.shadowNumber}
                          onChange={(e) => handleCardChange(index, 'shadowNumber', e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>PIN</Form.Label>
                        <Form.Control
                          placeholder="PIN"
                          value={card.pin}
                          onChange={(e) => handleCardChange(index, 'pin', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Держатель карты</Form.Label>
                        <Form.Control
                          placeholder="Держатель карты"
                          value={card.holder}
                          onChange={(e) => handleCardChange(index, 'holder', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Компания</Form.Label>
                        <Form.Control
                          placeholder="Компания"
                          value={card.supplier}
                          onChange={(e) => handleCardChange(index, 'supplier', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeCard(index)}
                  >
                    Удалить карту
                  </Button>
                </Card>
              ))}
              <h5 className="mt-4">Типы топлива</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>АИ-92</Form.Label>
                    <Form.Control
                      placeholder="Цена АИ-92"
                      name="ai92"
                      value={formData.ai92}
                      onChange={handleNumberChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>АИ-95</Form.Label>
                    <Form.Control
                      placeholder="Цена АИ-95"
                      name="ai95"
                      value={formData.ai95}
                      onChange={handleNumberChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ДТ</Form.Label>
                    <Form.Control
                      placeholder="Цена ДТ"
                      name="dt"
                      value={formData.dt}
                      onChange={handleNumberChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>СПБТ</Form.Label>
                    <Form.Control
                      placeholder="Цена СПБТ"
                      name="spbt"
                      value={formData.spbt}
                      onChange={handleNumberChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          <Button
            style={{
              marginTop: 20,
              border: "1px solid gray",
              padding: 10,
              borderRadius: 12,
            }}
            className="col-12"
            variant={"outline-success"}
            type="submit"
          >
            Создать пользователя
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateUserPage;
