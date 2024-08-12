
import React from 'react';

const PurchaseHistoryItem = ({ imageUrl, title, version, price }) => (
  <div className="flex gap-10 pr-2.5 rounded-md bg-zinc-300">
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

const PurchaseHistory = ({ purchases }) => {
  return (
    <div className="flex flex-col items-start px-3 pt-6 pb-6 mx-auto w-full text-xs leading-none text-black bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-8">
      <h2 className="ml-2.5 text-xl font-medium text-center">Historial de compras</h2>
      <div className="flex self-stretch mt-4 max-md:mt-10">
        <div className="flex flex-col grow gap-6 ">
          {purchases.map((purchase, index) => (
            <PurchaseHistoryItem key={index} {...purchase} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;