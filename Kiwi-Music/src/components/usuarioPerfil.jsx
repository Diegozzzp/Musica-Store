import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { FaMailchimp } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';

const UserProfile = ({ name, email, phone }) => {
  return (
    <div className="flex flex-col w-[33%] max-md:ml-0 max-lg:w-full rounded-2xl">
      <div className="flex flex-col px-px w-full text-xl leading-none text-black bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-8">
        <div className="flex flex-col items-center ">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/59ec1edcab8c0d87f36db99b24e29aade77ef232536d70d75a6bf8880dbef112?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19" alt="User Profile" className="object-contain max-w-full aspect-square w-[198px] flex" />
        </div>
        <div className="self-center mt-4 text-4xl leading-10 text-center">
          {name} <br />
        </div>
        <button className="self-center px-10 py-3 mt-12 max-w-full text-center text-white rounded-2xl bg-slate-500 bg-opacity-80 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[199px] max-md:px-5 max-md:mt-10">
          Cerrar Sesión
        </button>
        <div className="flex flex-col items-start pt-8 pr-20 pb-12 pl-7 mt-9 w-full text-sm font-extralight bg-red-50 rounded-2xl max-md:px-5">
            <div className="flex gap-8 whitespace-nowrap">
                <FaMailchimp className="text-2xl" />
            <div className="basis-auto">{email}</div>
          </div>
            <div className="flex gap-4 mt-7">
                <FaPhone className="text-2xl" />
            <div className="my-auto basis-auto">{phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;