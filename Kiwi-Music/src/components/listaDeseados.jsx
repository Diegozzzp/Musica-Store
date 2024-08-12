import React from 'react';

const WishlistItem = ({ imageUrl, title, version, price }) => (
  <div className="flex grow gap-10 pr-2.5 w-full text-xs leading-none text-black rounded-md bg-zinc-300 max-md:mt-10">
    <img loading="lazy" src={imageUrl} alt={title} className="object-contain shrink-0 max-w-full aspect-[1.18] w-[157px]" />
    <div className="flex flex-col flex-1 items-start my-auto">
      <div className="text-center">{title}</div>
      <div className="mt-6">
        Version : <span className="font-light">{version}</span>
      </div>
      <div className="mt-6">Precio : {price}</div>
      <div className="self-end mt-4 font-light text-neutral-700">Y 5 cosas mas</div>
    </div>
  </div>
);

const Wishlist = ({ items }) => {
  return (
    <section className="flex flex-col py-6 pr-12 pl-6 mt-10 w-full bg-white rounded-2xl max-md:px-5 max-md:max-w-full">
      <h2 className="self-start text-xl font-medium leading-none text-center text-black">Wishlist</h2>
      <div className="self-end mt-3 w-full max-w-[1257px] max-md:max-w-full">
        <div className="flex gap-5 max-lg:flex-col">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <WishlistItem {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;