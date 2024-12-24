import { useSearchParams } from "react-router-dom";

const useCRUD = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // React Router's search params hook

  // Function to add or update a query parameter for "create"
  const create = () => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("action", "create");
    setSearchParams(updatedParams); // Updates the URL
  };

  // Function to add or update query parameters for "edit"
  const edit = (editId: string) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("action", "edit");
    updatedParams.set("id", editId);
    setSearchParams(updatedParams); // Updates the URL
  };

  return {
    params: searchParams,
    create,
    edit,
  };
};

export default useCRUD;
