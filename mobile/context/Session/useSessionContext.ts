import { useContext } from "react";
import SessionContext from "./SessionContext";

export default function useSessionContext() {
  const session = useContext(SessionContext);

  if (!session)
    throw new Error("useSession() context must be called inside a provider");

  return session;
}
