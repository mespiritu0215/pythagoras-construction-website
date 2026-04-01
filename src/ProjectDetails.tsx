import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px", fontFamily: "Montserrat" }}>
      <h1 style={{ color: "#920000" }}>Project Details</h1>
      <p>Project ID: {id}</p>

      <p>
        This is where you can display full project information, images, and
        descriptions.
      </p>
    </div>
  );
}