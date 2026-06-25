import { Navigate } from "react-router-dom";
import { temPermissao } from "../permissoes";

const ProtectedRoute = ({
  permissao,
  children,
}) => {

  if (!temPermissao(permissao)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
};

export default ProtectedRoute;
