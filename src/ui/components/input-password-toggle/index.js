import { Fragment, useState, forwardRef } from "react";
import { Eye, EyeOff } from "react-feather";
import {  Input, InputGroupText, Label } from "reactstrap";
import classnames from "classnames";

const InputPasswordToggle = forwardRef((props, ref) => {
  const {
    label,
    visible = false,
    className,
    htmlFor,
    placeholder,
    iconSize,
    inputClassName,
    invalid,
    ...rest
  } = props;

  const [inputVisibility, setInputVisibility] = useState(visible);

  const renderIcon = () => {
    const size = iconSize || 14;
    return inputVisibility
      ? <EyeOff size={size} />
      : <Eye size={size} />;
  };

  const handleIconClick = (e) => {
    e.preventDefault();
    setInputVisibility(!inputVisibility);
  };

  return (
    <Fragment>
      {label && (
        <Label
          className="block text-sm font-medium text-gray-700"
          htmlFor={htmlFor}
        >
          {label}
          <span className="text-red-500">*</span>
        </Label>
      )}
      <div className={classnames("relative", className)}>
        <Input
          ref={ref}
          invalid={invalid}
          type={inputVisibility ? "text" : "password"}
          placeholder={placeholder || "············"}
          className={classnames(
            "w-full h-auto px-4 py-2 border border-gray-300 rounded-md items-center focus:outline-none focus:ring-2 focus:ring-indigo-500",
            inputClassName
          )}
          style={{ paddingRight: "2.5rem" }}
          {...(htmlFor ? { id: htmlFor } : {})}
          {...rest}
        />
        <InputGroupText
          className="absolute inset-y-0 right-4 top-2 flex items-center text-gray-500 cursor-pointer"
          onClick={handleIconClick}
        >
          {renderIcon()}
        </InputGroupText>
      </div>
    </Fragment>
  );
});

InputPasswordToggle.displayName = 'InputPasswordToggle';

export default InputPasswordToggle;
