import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

function ProjectsLayout() {
    const {id} = useParams();
    console.log(id);
  return (
    <>
      <Outlet id={id}/>
    </>
  );
}

export default ProjectsLayout;
