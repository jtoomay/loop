import { createContext } from "react";
import { SessionContextType } from "./SessionProvider";

const SessionContext = createContext<SessionContextType | null>(null);

export default SessionContext;
