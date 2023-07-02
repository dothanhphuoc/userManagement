import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { putUpdateUser } from "../../services/userService";

const ModalEditUser = (props) => {
  const { isShowMadalEdit, handleClose, dataUserEdit, handleSaveBeforeEdit } =
    props;

  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleEditUser = async () => {
    let res = await putUpdateUser(name, job);

    if (res && res.updatedAt) {
      handleSaveBeforeEdit({
        first_name: name,
        id: dataUserEdit.id,
      });

      handleClose();

      toast.success("Bạn Đã Chỉnh Sửa Thành Công!!!");
    }
  };

  useEffect(() => {
    if (isShowMadalEdit) {
      setName(dataUserEdit.first_name);
    }
    //eslint-disable-next-line
  }, [dataUserEdit]);

  return (
    <>
      <Modal
        show={isShowMadalEdit}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Job</label>
                <input
                  type="text"
                  className="form-control"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditUser;
