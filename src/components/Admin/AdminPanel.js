import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Pagination from '../Pagination';
import { server } from '../../services/axios';

const AdminPanel = () => {
  const {state} = useLocation();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [perPage, setPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [retMessage, setRetMessage] = useState("");

  let currentUsers = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentUsers = users.length ? users.slice(firstIndex, lastIndex) : [];

  const handleDelete = async id => {
    

    try {
      await server.delete(`/user/${id}`);
      window.location.reload();

    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    server.get(`/users`).then(ret => {setUsers(ret.data.users); setRetMessage(ret.data.message)}); 
  }, []);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
      </div>

      <div className='row-span-8 bg-secondary flex flex-col'>
        <button onClick={() => navigate("/host/add/mode", {state})} class="w-68 mx-auto mt-2 px-3 py-2 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center">
          <Icon icon="dashicons:welcome-write-blog" color="#233c3b" height="22" className='mr-2 mb-0.5'/>
          <p className='text-textMain text-xl font-semibold uppercase'>add new blog post</p>
        </button>

        <div className='m-auto bg-primary pt-12 p-6 pb-4 flex flex-col'>
          <div className="m-auto text-white relative bottom-6 flex items-center">
            <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("Users")}</h1>
          </div>

          {
            users.length == 0 && (
              
                retMessage == "This app has no users" ? (
                  <div class="col-span-3 flex items-center justify-center">
                    <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("no-results")}</h1>

                  </div>
                ) : (
                  <div class="col-span-3 flex items-center justify-center">
                    <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )
              
              
            )
          }

            <div className='accordion w-512 h-80' id="accordionusers">
            {
              currentUsers.map((user) => (
                <div class="accordion-item bg-white border border-gray-200">
                  <h2 class="accordion-header mb-0" id="headingOne">
                    <button class="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b]text-left bg-white border-0 rounded-none transition focus:outline-none;"
                    type="button" data-bs-toggle="collapse" data-bs-target={`#id${user._id}`} aria-expanded="false"
                    aria-controls="collapseOne">
                      user from {user.first_name}
                    </button>
                  </h2>
                  <div id={`id${user._id}`}class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionusers">
                    <div class="accordion-body py-2 px-5 text-sm flex justify-between">
          
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>Full Name: {user.first_name} {user.last_name}</h5>
              
                      </div>
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>Rating:  {user.grade}/10 ({user.review_count} ratings)</h5>
                          <h5>Email: {user.email} </h5>
                          <h5>Phone: {user.phone}</h5>
                      </div>
                      
                      <div className='flex ml-4 mr-16 flex-col my-auto gap-1'>
                          <h5>Personal Info: {user.personal_info} </h5>
                          <h5>Purpose: {user.purpose} </h5>
                          <h5>Interests:  {user.interests}</h5>
                      </div>
                      <div className='flex flex-row gap-4 my-auto mr-4'>
                        <button className='w-9 h-9 m-auto rounded-full bg-primary hover:bg-secondary transition-colors duration-300 px-1.5' 
                          onClick={() => {handleDelete(user._id)}}>
                          <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
            {
              users.length != 0 &&
                <Pagination perPage={perPage} totalPosts={users.length} paginate={paginate} currentPage={currentPage}/>

            } 
        </div>
        
      </div>

    </div>
  )
}

export default AdminPanel