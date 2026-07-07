import React from "react";

const Avatar = ({ nome, foto, size = 42 }) => {
  const iniciais = nome
    ? nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="
        rounded-full
        overflow-hidden
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        flex
        items-center
        justify-center
        text-white
        font-bold
        shadow-md
        border-2
        border-white/20
      "
    >
      {foto ? (
        <img
          src={foto}
          alt={nome}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{iniciais}</span>
      )}
    </div>
  );
};

export default Avatar;
