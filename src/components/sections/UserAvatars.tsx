import React from "react";
import Image from "next/image";
const UserAvatars = ({
  USERS,
}: {
  USERS: { id: number; src: string; alt: string }[];
}) => {
  return (
    <div className="flex justify-start mt-6">
      {USERS.map((user) => (
        <Image
          key={user.id}
          src={user.src}
          alt={user.alt}
          width={50}
          height={50}
          className="rounded-full h-6 w-6 my-auto object-cover ring-2 ring-green-950"
        />
      ))}
      <p className="ml-2 my-auto text-sm text-slate-400">
        Loved by 1000+ happy users
      </p>
    </div>
  );
};

export default UserAvatars;
