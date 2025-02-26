import React, { Fragment } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Eye, Trash, Edit } from "react-feather";
import Switch from "react-switch";

import "react-perfect-scrollbar/dist/css/styles.css";

const Table = ({
  columns,
  data,
  editData,
  deleteData,
  viewData,
  handleActiveUser,
}) => {
  const customStyles = {
    table: {
      style: {
        borderRadius: "12px",
        overflow: "hidden",
        width: "auto",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
    headRow: {
      style: {
        background: "linear-gradient(to top, #3b82f6, #7e22ce)",
        borderBottom: "1px solid #e2e8f0",
      },
    },
    headCells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        fontWeight: "600",
        color: "white",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:nth-child(even)": {
          // backgroundColor: "#f7fafc",
        },
        "&:hover": {
          backgroundColor: "#edf2f7",
          transition: "background-color 0.3s ease",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        color: "#4a5568",
      },
    },
  };

  const generateActionColumns = () => {
    const baseColumns = [...columns];

    if (handleActiveUser) {
      baseColumns.push({
        name: "Status",
        minWidth: "80px",
        selector: (row) =>
          row.isDeleted ? "Deleted" : row.isVerified ? "Active" : "Inactive",
        cell: (row) =>
          row.isDeleted ? (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              Deleted
            </span>
          ) : (
            <div className="flex items-center">
              <Switch
                checked={row.isVerified}
                onChange={() => handleActiveUser(row)}
                onColor="#48bb78"
                offColor="#e53e3e"
                onHandleColor="#ffffff"
                offHandleColor="#ffffff"
                handleDiameter={18}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="mr-2"
              />
              <span
                className={`text-xs font-medium ${
                  row.isVerified
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {row.isVerified ? "Active" : "Inactive"}
              </span>
            </div>
          ),
      });

      baseColumns.push({
        name: "Actions",
        selector: (row) => row.actions,
        cell: (row) => (
          <div className="flex space-x-3 justify-center">
            {editData && !row.isDeleted ? (
              <button
                onClick={() => editData(row)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out"
              >
                <Edit size={16} />
              </button>
            ) : null}
            {deleteData && !row.isDeleted ? (
              <button
                onClick={() => deleteData(row)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200 ease-in-out"
              >
                <Trash size={16} />
              </button>
            ) : null}
            {viewData && row?.isVerified ? (
              <button
                onClick={() => viewData(row)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out"
              >
                <Eye size={16} />
              </button>
            ) : null}
          </div>
        ),
      });
    }

    return baseColumns;
  };

  return (
    <Fragment>
     <div className="react-dataTable w-full rounded-xl overflow-hidden shadow-md" id="data-table">
        <DataTable
          columns={generateActionColumns()}
          data={data}
          customStyles={customStyles}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15, 20,25,50,75,100]}
          sortIcon={<ChevronDown />}
        className="w-full"
        />
      </div>
    </Fragment>
  );
};

export default Table;
