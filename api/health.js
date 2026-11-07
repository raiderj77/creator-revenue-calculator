// Health route: answers with the deployed version so a rollback or deploy can
// be verified from outside. No secrets, no upstream calls.
export default function handler(request, response) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(
    JSON.stringify({
      status: "ok",
      service: "creatorrevenuecalculator.com",
      version: process.env.VERCEL_GIT_COMMIT_SHA || "local",
      environment: process.env.VERCEL_ENV || "development",
    }),
  );
}
