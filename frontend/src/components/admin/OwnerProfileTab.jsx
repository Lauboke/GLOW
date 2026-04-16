import React from "react";

const OwnerProfileTab = () => {
  const ownerProfile = {
    name: "Lauryin Boke",
    role: "Owner / Super Admin",
    email: "your-email@example.com",
    phone: "+254 7XX XXX XXX",
    businessName: "Glow Beauty",
    location: "Nairobi, Kenya",
    bio: "Founder and lead admin of Glow Beauty. Oversees appointments, staff management, client operations, inquiries, and business performance.",
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 md:space-y-8">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex justify-center md:justify-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-black text-white shadow-lg md:h-24 md:w-24 md:text-3xl">
              {ownerProfile.name.charAt(0)}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black uppercase italic text-gray-900 md:text-3xl">
              {ownerProfile.name}
            </h2>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-pink-500 md:text-sm md:tracking-widest">
              {ownerProfile.role}
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 md:mx-0">
              {ownerProfile.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Business Name
          </p>
          <h3 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
            {ownerProfile.businessName}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Location
          </p>
          <h3 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
            {ownerProfile.location}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Email
          </p>
          <h3 className="mt-2 break-all text-lg font-black text-gray-900 md:text-xl">
            {ownerProfile.email}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Phone
          </p>
          <h3 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
            {ownerProfile.phone}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfileTab;