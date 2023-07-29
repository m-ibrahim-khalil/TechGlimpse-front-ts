import UpdateProfileForm from '../form/update-profile-form/update-profile-form';

export interface UpdateProfileModalProps {
  setShowModal: (value: boolean) => void;
}

export function UpdateProfileModal({ setShowModal }: UpdateProfileModalProps) {
  return (
    <div className="fixed z-50 w-full p-10 overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-600 bg-opacity-50">
      <div className="relative top-20 mx-auto p-5 w-full max-w-md max-h-full">
        <UpdateProfileForm setShowModal={setShowModal} />
      </div>
    </div>
  );
}

export default UpdateProfileModal;