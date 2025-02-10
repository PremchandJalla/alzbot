import "@/styles/globals.css";
import { AuthProvider } from '../context/AuthContext';
import { PatientProvider } from '../context/PatientContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PatientProvider>
        <Component {...pageProps} />
      </PatientProvider>
    </AuthProvider>
  );
}
