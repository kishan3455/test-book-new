import { useState } from "react";
import NoteContext from "./notecontext";

const NoteState = (props) => {
  const s1 = {
    name: "hem",
    class: "10b",
  };
  const [state, setstate] = useState(s1);

  return (
    <NoteContext.Provider value={{}}>{props.children}</NoteContext.Provider>
  );
};

export default NoteState;
