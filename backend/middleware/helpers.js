// Generic helpers shared by route files
function asInt(v, def = 0) { const n = parseInt(v, 10); return Number.isFinite(n) ? n : def; }
function paginate(req) {
  const page = Math.max(1, asInt(req.query.page, 1));
  const limit = Math.min(200, Math.max(1, asInt(req.query.limit, 20)));
  return { page, limit, offset: (page - 1) * limit };
}
function ok(res, data) { return res.json({ ok: true, ...data }); }
function bad(res, msg, code = 400) { return res.status(code).json({ error: msg }); }

module.exports = { asInt, paginate, ok, bad };
