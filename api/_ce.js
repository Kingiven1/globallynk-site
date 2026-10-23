// Shared helpers for the Tables Turned voting API. (Files starting with _ are not public routes.)
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const SITE_URL = process.env.SITE_URL || 'https://globallynk.club';

export function adminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

// One real person = one key. Strips +tags, and dots for Gmail, so name+1@gmail.com can't vote twice.
export function emailKey(email) {
  let [local, domain] = String(email).trim().toLowerCase().split('@');
  local = (local || '').split('+')[0];
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '');
    domain = 'gmail.com';
  }
  return `${local}@${domain}`;
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

export function hashIp(ip) {
  const salt = process.env.VOTE_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'tables-turned';
  return crypto.createHash('sha256').update(`${ip}|${salt}`).digest('hex');
}

export async function getSettings(db) {
  const { data } = await db.from('ce_settings').select('*').eq('id', 1).maybeSingle();
  return data || { opens_at: null, closes_at: null, judge_weight: 0.5 };
}

export function votingState(settings, now = new Date()) {
  if (settings.opens_at && now < new Date(settings.opens_at)) return 'not_open';
  if (settings.closes_at && now > new Date(settings.closes_at)) return 'closed';
  return 'open';
}