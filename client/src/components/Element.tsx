import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";

type RequiredProps = {
  label: String;
  icon: IconDefinition | string;
};

type DefaulProps = {
  link: string;
};

type Props = RequiredProps & DefaulProps;

const closeSidebar = () => {
  const sidebar = document.getElementById("side");
  if (sidebar) sidebar.style.display = "none";
};

const Element = (props: Props) => {
  return (
    <Link to={props.link} onClick={closeSidebar}>
      <div className="flex flex-row gap-6 items-center mx-4">
        {typeof props.icon === "string" ? (
          <img src={props.icon} alt={"user"} className="w-5" />
        ) : (
          <FontAwesomeIcon icon={props.icon} className="w-5" />
        )}
        {props.label}
      </div>
    </Link>
  );
};

Element.defaultProps = {
  link: "/",
};

export default Element;
