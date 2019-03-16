import * as React from "react";
import cn from "classnames";

export enum BREED {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  LINK = "link"
}

interface Props extends React.HTMLProps<HTMLButtonElement> {
  breed?: BREED;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  block?: boolean;
  className?: string;
}


const Button: React.SFC<Props> = ({
  breed,
  children,
  className,
  onClick,
  block,
  ...rest
}) => (
  <button
    className={cn(
      {
        Button: true,
      },
      className
    )}
    type="button"
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

Button.defaultProps = {
  className: "",
  type: "button",
  block: false
};

Button.displayName = "Button";

export default Button;
