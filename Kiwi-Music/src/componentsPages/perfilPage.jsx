import React from 'react';
import Wishlist from '../components/wishList';
import PurchaseHistory from '../components/historial';
import UserData from '../components/usuarioData';
import UserProfile from '../components/usuarioPerfil';


const UserDashboard = () => {
  const userData = {
    name: "Rajesh Koothrappali",
    email: "tucorreo.example@gmial.com",
    phone: "+58 412-881-5920",
  };

  const purchaseHistory = [
    { imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/07934f261930c41718f41a47a17aa9822d7f81b006606620fb68f94142acd132?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19", title: "Album Happier Than Ever", version: "Vinilo - Limitado", price: "35$" },
    { imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/07934f261930c41718f41a47a17aa9822d7f81b006606620fb68f94142acd132?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19", title: "Album Happier Than Ever", version: "Vinilo - Limitado", price: "35$" },
    { imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/07934f261930c41718f41a47a17aa9822d7f81b006606620fb68f94142acd132?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19", title: "Album Happier Than Ever", version: "Vinilo - Limitado", price: "35$" },
  ];

  const wishlistItems = [
    { imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/07934f261930c41718f41a47a17aa9822d7f81b006606620fb68f94142acd132?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19", title: "Album Happier Than Ever", version: "Vinilo - Limitado", price: "35$" },
    { imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/07934f261930c41718f41a47a17aa9822d7f81b006606620fb68f94142acd132?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19", title: "Album Happier Than Ever", version: "Vinilo - Limitado", price: "35$" },
    { imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/07934f261930c41718f41a47a17aa9822d7f81b006606620fb68f94142acd132?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19", title: "Album Happier Than Ever", version: "Vinilo - Limitado", price: "35$" },
  ];

  return (
    <div className="flex overflow-hidden flex-col bg-white items-center">
      <main className="flex flex-col px-9 pt-7 pb-6 w-full bg-zinc-300 max-md:px-5 max-lg:max-w-full scroll-behavior">
        <div className="max-md:max-w-full">
          <div className="flex gap-5 max-lg:flex-col w-full ">
            <UserProfile {...userData}  />
            <div className="flex flex-col  w-[33%] max-md:ml-0 max-lg:w-full">
              <UserData name={userData.name} lastName="Koothrappali" phone={userData.phone} />
            </div>
            <div className="flex flex-col w-[33%] max-md:ml-0 max-lg:w-full">
              <PurchaseHistory purchases={purchaseHistory} />
            </div>
          </div>
          <div className='flex flex-col max-md:ml-0 max-xl:w-full'>
            <Wishlist items={wishlistItems} />
          </div>
        </div>
       
      </main>
    </div>
  );
};

export default UserDashboard;