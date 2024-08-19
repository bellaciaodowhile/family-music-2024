import { NavLink } from 'react-router-dom';
import '../assets/css/NotFound.css';

export const NotFound = () => {
  return (
    <>
     <div className="main-error-404 flex-col">
      <div title="404" className='error-404'>404</div>
      <NavLink to={'/'} className="text-red-500 text-5xl bg-white">
        Inicio
      </NavLink>
     </div>
    </>
  )
}
