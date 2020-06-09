import { useMemo } from 'react';
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';

export default function useRouter() {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  return useMemo(() => ({
    params,
    location,
    history,
    match,
    pathname: location.pathname,
    push: history.push,
    replace: history.replace
  }), [params, location, history, match])
}