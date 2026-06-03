// ─────────────────────────────────────────────────────────────────────────────
// EMDAD — Admin password hash generator
//
// Produces a salted scrypt hash to store as ADMIN_PASS_HASH in .env, so the
// plaintext admin password never lives in a file.
//
// Usage:
//   npm run hash-password -- "your-password"     (quick)
//   echo "your-password" | npm run hash-password (keeps it out of shell history)
//   npm run hash-password                        (interactive prompt)
// ─────────────────────────────────────────────────────────────────────────────
import crypto from "crypto";

function hashPassword(password) {
  const N = 16384,
    r = 8,
    p = 1,
    keylen = 64;
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, keylen, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function output(pw) {
  if (!pw) {
    console.error("No password provided.");
    process.exit(1);
  }
  const hash = hashPassword(pw);
  console.log("\nAdd this to your .env (and remove any plaintext ADMIN_PASS):\n");
  console.log("ADMIN_PASS_HASH=" + hash + "\n");
}

const argPw = process.argv[2];
if (argPw) {
  output(argPw);
} else if (!process.stdin.isTTY) {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (data += c));
  process.stdin.on("end", () => output(data.replace(/\r?\n$/, "")));
} else {
  const { createInterface } = await import("readline");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Password to hash: ", (answer) => {
    rl.close();
    output(answer);
  });
}
