// Dipakai saat build saja: merender beranda jadi HTML statis supaya langsung tampil sebelum JavaScript jalan.
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(<App />);
}
