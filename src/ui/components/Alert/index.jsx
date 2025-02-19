import Swal from 'sweetalert2'

const ConfirmationModal = (status,title,text,btntext,show) => {
   return Swal.fire({
        title: title,
        text: text,
        icon: status,
        showCancelButton: show,
        confirmButtonText: btntext,
        confirmButtonColor:"#28a745",
        cancelButtonText: 'No, cancel!',
        cancelButtonColor:"#dc3545",
        reverseButtons: false
      })
}

export default ConfirmationModal
