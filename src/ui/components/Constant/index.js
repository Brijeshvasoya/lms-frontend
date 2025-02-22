export const userTable = [
  {
    selector: (row) => row?.fname,
    name: "First Name",
    sortField: "fname",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.lname,
    name: "Last Name",
    sortField: "lname",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.email,
    name: "Email",
    sortField: "email",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.age,
    name: "Age",
    sortField: "age",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.dob,
    name: "Birth Date",
    sortField: "dob",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.role,
    name: "Role",
    sortField: "role",
    sortable: true,
    minwidth: "150px",
  },
];

export const userBookTable = [
  {
    selector: (row) => row?.bookid?.title,
    name: "Book Title",
    sortField: "bookid.title",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.bookid?.author,
    name: "Author",
    sortField: "bookid.author",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.issuedDate,
    name: "Issued Date",
    sortField: "issuedDate",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.bookToBeReturned,
    name: "Book To Be Returned",
    sortField: "bookToBeReturned",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.returnDate,
    name: "Return Date",
    sortField: "returnDate",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) => row?.panalty,
    name: "Penalty",
    sortField: "panalty",
    sortable: true,
    minwidth: "150px",
  },
  {
    selector: (row) =>
      row?.isReturned ? (
        <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium">
          Returned
        </span>
      ) : (
        <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium">
          Not Returned
        </span>
      ),
    name: "Status",
    sortField: "isReturned",
    sortable: true,
    minWidth: "150px",
  },
];
