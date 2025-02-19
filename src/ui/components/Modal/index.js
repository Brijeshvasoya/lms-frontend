import React, { Fragment } from "react";
import { Modal, ModalBody, ModalHeader, Badge } from "reactstrap";
import { X } from "react-feather";
import "./model.css";

const index = (props) => {
  return (
    <Fragment>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${
          props.modalOpen ? "backdrop-blur-sm" : "hidden"
        }`}
        style={{ zIndex: props.modalOpen ? 999 : -1 }}
      ></div>
      <Modal
        isOpen={props.modalOpen}
        toggle={props.toggle}
        className="fixed inset-0 z-50 flex justify-center items-center"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <ModalHeader className="relative flex items-center justify-between p-4 border-b border-gray-200 rounded-t-lg">
            <Badge
              className="bg-[#f3f2f0] hover:bg-gray-100 absolute -right-2 -top-2 p-1 rounded-full cursor-pointer"
              onClick={props.toggle}
            >
              <X className="text-gray-600 w-6 h-6" />
            </Badge>
            <h1 className="text-2xl font-semibold mx-auto">{props.title}</h1>
          </ModalHeader>

          <ModalBody className="p-4 rounded-b-lg">{props?.children}</ModalBody>
        </div>
      </Modal>
    </Fragment>
  );
};

export default index;
