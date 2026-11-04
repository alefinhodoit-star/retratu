// Arranca a API e o Vite em paralelo, com um único Ctrl+C para os dois.

import { spawn } from "node:child_process";

const processos = [];
let aEncerrar = false;

function encerrar() {
  if (aEncerrar) return;
  aEncerrar = true;

  for (const processo of processos) {
    try {
      processo.kill();
    } catch {
      // já terminou
    }
  }

  process.exit(0);
}

function arrancar(comando, argumentos, etiqueta) {
  const processo = spawn(comando, argumentos, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  processo.on("exit", (codigo) => {
    if (codigo && codigo !== 0) {
      console.error(`[${etiqueta}] terminou com código ${codigo}`);
      encerrar();
    }
  });

  processos.push(processo);
}

process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);

arrancar("node", ["server/index.js"], "api");
arrancar("npm", ["run", "dev"], "web");
