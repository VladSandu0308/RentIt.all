import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { server } from '../services/axios';
import Footer from './Footer'
import Navbar from './Navbar'
import Pagination from './Pagination';

const Blog = () => {
  const {state} = useLocation();
  const {t} = useTranslation();
  const [posts, setPosts] = useState([]);

  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);

  let currentPosts = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentPosts = posts.length ? posts.slice(firstIndex, lastIndex) : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    server.get(`/blog`).then(ret => {setPosts(ret.data.posts)}); 
  }, []);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current="Blog" state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary'>
        <div class="flex justify-around mt-4">
          {
            currentPosts.map((post) => (
              <div className='rounded-lg shadow-lg bg-white w-96 flex flex-col overflow-y-auto scrollbar-hide h-128 mt-12 2xl:h-256 p-1'>
                <img class="rounded-t-lg w-full h-48 object-cover" src={post.cover} alt="cover"></img>
                <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{post.title}</h1>
                <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4 mb-8" />
                <h1 className='ml-4 text-md first-letter:uppercase'>{post.body}</h1>
              </div>
            ))
          }
        </div>
        <div className='bg-secondary mx-auto absolute inset-x-0 bottom-16'>

          <Pagination perPage={perPage} totalPosts={posts.length} paginate={paginate} currentPage={currentPage}/>
        </div>
      </div>
        
      <div className='bottom-0'>
      <Footer />   
      </div>
       
    </div>
  )
}

export default Blog