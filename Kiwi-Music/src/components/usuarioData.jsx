import React from 'react';

const UserData = ({ name, lastName, phone }) => {
  return (
    <div className="flex flex-col  pt-7 pb-32 mx-auto w-full bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:pb-24 max-md:pl-5 max-md:mt-8 max-lg:max-w-full">
      <div className="max-md:max-w-full">
        <div className="flex gap-5 max-lg:flex-col">
          <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
            <div className="flex flex-col  items-start text-xl font-light leading-none text-zinc-500 max-md:mt-10">
              <div className="font-medium text-black ">Tus datos</div>
                <div className="flex flex-row justify-between w-full lg:w-full pt-8">
                    <h2>Nombre:</h2>
                    <p>{name}</p>
                </div>
                <div className="pt-8 flex flex-row justify-between w-full lg:w-full ">
                    <h2>Apellido</h2>
                    <p>{lastName}</p>
                </div>
                <div className="pt-8 flex flex-row justify-between w-full lg:w-full">
                    <h2>Teléfono</h2>
                    <p>{phone}</p>
                </div>
                <div className="flex flex-row justify-between w-full lg:w-full pt-8 items-center">
                    <h2>Password</h2>
                    <p>********</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      <button className="self-center px-14 py-3 mt-28 max-w-full text-xl font-light leading-none text-black whitespace-nowrap bg-green-300 rounded-3xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[199px] max-md:px-5 max-md:mt-10">
        Modificar
      </button>
    </div>
  );
};

export default UserData;