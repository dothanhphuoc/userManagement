import { Modal, Button } from "react-bootstrap";
import { deleteUser } from "../../services/userService";
import { toast } from "react-toastify";


const ModalConfirm = (props) => {
  const { handleClose, isShowModalDelete, dataUserDelete, handleDeleteUserFromModal} = props;

  const confirmDelete = async () => {
    let res = await deleteUser(dataUserDelete.id)

    if(res && +res.statusCode === 204) {
        toast.success('Bạn Đã Xóa Người Dùng Thành Công');
        handleDeleteUserFromModal(dataUserDelete)
        handleClose();
    } else {
        toast.error('Bạn Xóa Người Dùng Thất Bại');
        handleClose();
    }
 }
  
  return (
    <>
      <Modal
        show={isShowModalDelete}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
                <h5>Bạn có chắc chắn muốn xóa không?</h5>
                
                Người dùng có: <b>email = {dataUserDelete.email} && id = {dataUserDelete.id}</b> 


          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfirm;
