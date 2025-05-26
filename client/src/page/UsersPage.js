import React, { useContext, useEffect, useState } from "react";
import { fetchDrivers, fetchUsers } from "../http/userAPI";
import { Link } from "react-router-dom";
import { Context } from "../index";
import { fetchCompanies, fetchDepartments } from "../http/UtilsApi";

function getRole(role) {
   if (role === 'driver') return 'Водитель'
   if (role === 'manager') return 'Менеджер'
   if (role === 'admin') return 'Администратор'

}

const UsersPage = () => {
   const [users, setUsers] = useState([]);
   const [filterName, setFilterName] = useState("");
   const [filters, setFilters] = useState({
      role: '',
      department: '',
      company: ''
   });
   const [departments, setDepartments] = useState([]);
   const [companies, setCompanies] = useState([]);
   const { user } = useContext(Context);

   useEffect(() => {

      if (user.user.permissions.role === "manager") {
         fetchDrivers().then((data) => {
            setUsers(data.data);
         });
         filters.role = "driver";
      }
      else {
         fetchUsers().then((data) => {
            setUsers(data.data);
         });
      }
      fetchCompanies().then(data => {
         setCompanies(Array.isArray(data) ? data.map(c => c.name || c) : []);
      });
      fetchDepartments().then(data => {
         setDepartments(Array.isArray(data) ? data : []);
      });
   }, []);

   const filteredUsers = users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(filterName.toLowerCase()) ||
         user.email.toLowerCase().includes(filterName.toLowerCase());
      const roleMatch = !filters.role || user.permissions?.role === filters.role;
      let departmentMatch = true;
      if (filters.department && user.permissions?.role === 'driver') {
         departmentMatch = user.departmentId === filters.department;
      }

      let companyMatch = true;
      if (filters.company && user.permissions?.role === 'driver') {
         companyMatch = user.companyName === filters.company;
      }

      console.log(user)
      return nameMatch && roleMatch && departmentMatch && companyMatch;
   });
   return (<>
      <div
         style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            gap: "6px",
            background: "#d3d3d3",
            borderRadius: 12,
         }}
      >
         <input
            style={{
               padding: 12, borderRadius: 12, outline: "none", width: "100%",
            }}
            type="text"
            placeholder="Поиск по названию или email"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
         />
         <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {/* Фильтр по роли */}
            <select
               style={{ padding: 8, borderRadius: 12, flex: 1 }}
               value={filters.role}
               onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
               {user.user.permissions.role === "admin" && (
                  <>
                     <option value="">Все роли</option>
                     <option value="admin">Администраторы</option>
                     <option value="manager">Менеджеры</option>
                  </>
               )
               }
               <option value="driver">Водители</option>
            </select>

            {/* Фильтр по отделу (только для админов) */}
            {filters.role === "driver" && (
               <>                  <select
                  style={{ padding: 12, borderRadius: 12, flex: 1 }}
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
               >
                  <option value="">Все отделы</option>
                  {departments.map(dept => (
                     <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
               </select>
                  <select
                     style={{ padding: 12, borderRadius: 12, flex: 1 }}
                     value={filters.company}
                     onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                  >
                     <option value="">Все компании</option>
                     {companies.map(comp => (
                        <option key={comp}>{comp}</option>
                     ))}
                  </select>
               </>
            )

            }
         </div>
      </div>

      {filteredUsers.length ? filteredUsers.map(user => {
         if (!(user.name.toLowerCase().includes(filterName.toLowerCase()) || user.email.toLowerCase().includes(filterName.toLowerCase()))) return;
         return (<div
            key={"list-" + user.id}
            style={{
               padding: "12px 12px", marginTop: 12, background: "#ededed", borderRadius: 8,
            }}
         >
            <div style={{
               display: "flex",
               flexDirection: "column",
               gap: "5px",
               justifyContent: "space-between"
            }}>
               <div style={{
                  display: "flex",
                  justifyContent: "space-between"
               }}>
                  <Link
                     to={user.id}
                     style={{ color: "#3d3d3d", fontSize: "1.2rem", paddingLeft: 8 }}
                  >
                     {user.name || user.email}
                  </Link>
                  <span
                     style={{
                        fontSize: "14px",
                        background: "#198754",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "16px"

                     }}
                  >
                     {getRole(user.permissions.role)}
                  </span>
               </div>
               {user.permissions.role === 'driver' && (
                  <div style={{
                     placeSelf: "end",
                     marginTop: "5px",
                  }}>
                     <span style={{
                        fontSize: "14px",
                        background: "#0d6efd",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "16px",
                        marginRight: "3px"
                     }}>
                        Отдел: {user.departmentName}
                     </span>
                     <span style={{
                        fontSize: "14px",
                        background: "#6f42c1",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "16px"
                     }}>
                        {user.companyName}
                     </span>
                  </div>
               )}
            </div>
         </div>);
      }) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500 }}>
         Ничего не найдено
      </div>}
   </>);
};

export default UsersPage;
