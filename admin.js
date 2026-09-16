(() => {
  let adminPin = '';
  // Rank definitions are embedded in the app bundle so belt/student admin never
  // depends on a separate ranks.json network request.
  let beltRanks = [{"order":1,"id":"UNOFFICIAL_WHITE","name":"Unofficial White Belt","category":"Underbelt","standardNextRankId":"WHITE","eliteEligible":false,"image":"unofficial_white.png","eliteImage":""},{"order":2,"id":"WHITE","name":"White Belt","category":"Underbelt","standardNextRankId":"YELLOW","eliteEligible":true,"image":"white.png","eliteImage":"white_elite.png"},{"order":3,"id":"WHITE_BAR_1","name":"White Belt Bar 1","category":"Underbelt","standardNextRankId":"YELLOW","eliteEligible":false,"image":"white_bar_1.png","eliteImage":""},{"order":4,"id":"WHITE_BAR_2","name":"White Belt Bar 2","category":"Underbelt","standardNextRankId":"YELLOW","eliteEligible":false,"image":"white_bar_2.png","eliteImage":""},{"order":5,"id":"YELLOW","name":"Yellow Belt","category":"Underbelt","standardNextRankId":"ORANGE","eliteEligible":true,"image":"yellow.png","eliteImage":"yellow_elite.png"},{"order":6,"id":"YELLOW_BAR_1","name":"Yellow Belt Bar 1","category":"Underbelt","standardNextRankId":"ORANGE","eliteEligible":false,"image":"yellow_bar_1.png","eliteImage":""},{"order":7,"id":"YELLOW_BAR_2","name":"Yellow Belt Bar 2","category":"Underbelt","standardNextRankId":"ORANGE","eliteEligible":false,"image":"yellow_bar_2.png","eliteImage":""},{"order":8,"id":"ORANGE","name":"Orange Belt","category":"Underbelt","standardNextRankId":"GREEN","eliteEligible":true,"image":"orange.png","eliteImage":"orange_elite.png"},{"order":9,"id":"ORANGE_BAR_1","name":"Orange Belt Bar 1","category":"Underbelt","standardNextRankId":"GREEN","eliteEligible":false,"image":"orange_bar_1.png","eliteImage":""},{"order":10,"id":"ORANGE_BAR_2","name":"Orange Belt Bar 2","category":"Underbelt","standardNextRankId":"GREEN","eliteEligible":false,"image":"orange_bar_2.png","eliteImage":""},{"order":11,"id":"GREEN","name":"Green Belt","category":"Underbelt","standardNextRankId":"BLUE","eliteEligible":true,"image":"green.png","eliteImage":"green_elite.png"},{"order":12,"id":"GREEN_BAR_1","name":"Green Belt Bar 1","category":"Underbelt","standardNextRankId":"BLUE","eliteEligible":false,"image":"green_bar_1.png","eliteImage":""},{"order":13,"id":"GREEN_BAR_2","name":"Green Belt Bar 2","category":"Underbelt","standardNextRankId":"BLUE","eliteEligible":false,"image":"green_bar_2.png","eliteImage":""},{"order":14,"id":"BLUE","name":"Blue Belt","category":"Underbelt","standardNextRankId":"PURPLE","eliteEligible":true,"image":"blue.png","eliteImage":"blue_elite.png"},{"order":15,"id":"BLUE_BAR_1","name":"Blue Belt Bar 1","category":"Underbelt","standardNextRankId":"PURPLE","eliteEligible":false,"image":"blue_bar_1.png","eliteImage":""},{"order":16,"id":"BLUE_BAR_2","name":"Blue Belt Bar 2","category":"Underbelt","standardNextRankId":"PURPLE","eliteEligible":false,"image":"blue_bar_2.png","eliteImage":""},{"order":17,"id":"PURPLE","name":"Purple Belt","category":"Underbelt","standardNextRankId":"RED","eliteEligible":true,"image":"purple.png","eliteImage":"purple_elite.png"},{"order":18,"id":"PURPLE_BAR_1","name":"Purple Belt Bar 1","category":"Underbelt","standardNextRankId":"RED","eliteEligible":false,"image":"purple_bar_1.png","eliteImage":""},{"order":19,"id":"PURPLE_BAR_2","name":"Purple Belt Bar 2","category":"Underbelt","standardNextRankId":"RED","eliteEligible":false,"image":"purple_bar_2.png","eliteImage":""},{"order":20,"id":"RED","name":"Red Belt","category":"Underbelt","standardNextRankId":"BROWN_3_KYU","eliteEligible":true,"image":"red.png","eliteImage":"red_elite.png"},{"order":21,"id":"RED_BAR_1","name":"Red Belt Bar 1","category":"Underbelt","standardNextRankId":"BROWN_3_KYU","eliteEligible":false,"image":"red_bar_1.png","eliteImage":""},{"order":22,"id":"RED_BAR_2","name":"Red Belt Bar 2","category":"Underbelt","standardNextRankId":"BROWN_3_KYU","eliteEligible":false,"image":"red_bar_2.png","eliteImage":""},{"order":23,"id":"BROWN_3_KYU","name":"Brown Belt 3rd Kyu","category":"Underbelt","standardNextRankId":"BROWN_2_KYU","eliteEligible":true,"image":"brown_3_kyu.png","eliteImage":"brown_3_kyu_elite.png"},{"order":24,"id":"BROWN_2_KYU","name":"Brown Belt 2nd Kyu","category":"Underbelt","standardNextRankId":"BROWN_1_KYU","eliteEligible":true,"image":"brown_2_kyu.png","eliteImage":"brown_2_kyu_elite.png"},{"order":25,"id":"BROWN_1_KYU","name":"Brown Belt 1st Kyu","category":"Underbelt","standardNextRankId":"BLACK_WHITE_STRIPE","eliteEligible":true,"image":"brown_1_kyu.png","eliteImage":"brown_1_kyu_elite.png"},{"order":26,"id":"BLACK_WHITE_STRIPE","name":"Blackbelt White Stripe","category":"Blackbelt","standardNextRankId":"BLACK_YELLOW_STRIPE","eliteEligible":false,"image":"black_white_stripe.png","eliteImage":""},{"order":27,"id":"BLACK_YELLOW_STRIPE","name":"Blackbelt Yellow Stripe","category":"Blackbelt","standardNextRankId":"BLACK_ORANGE_STRIPE","eliteEligible":false,"image":"black_yellow_stripe.png","eliteImage":""},{"order":28,"id":"BLACK_ORANGE_STRIPE","name":"Blackbelt Orange Stripe","category":"Blackbelt","standardNextRankId":"BLACK_GREEN_STRIPE","eliteEligible":false,"image":"black_orange_stripe.png","eliteImage":""},{"order":29,"id":"BLACK_GREEN_STRIPE","name":"Blackbelt Green Stripe","category":"Blackbelt","standardNextRankId":"BLACK_BLUE_STRIPE","eliteEligible":false,"image":"black_green_stripe.png","eliteImage":""},{"order":30,"id":"BLACK_BLUE_STRIPE","name":"Blackbelt Blue Stripe","category":"Blackbelt","standardNextRankId":"BLACK_PURPLE_STRIPE","eliteEligible":false,"image":"black_blue_stripe.png","eliteImage":""},{"order":31,"id":"BLACK_PURPLE_STRIPE","name":"Blackbelt Purple Stripe","category":"Blackbelt","standardNextRankId":"BLACK_BROWN_STRIPE","eliteEligible":false,"image":"black_purple_stripe.png","eliteImage":""},{"order":32,"id":"BLACK_BROWN_STRIPE","name":"Blackbelt Brown Stripe","category":"Blackbelt","standardNextRankId":"JET_BLACK","eliteEligible":false,"image":"black_brown_stripe.png","eliteImage":""},{"order":33,"id":"JET_BLACK","name":"Jet Blackbelt","category":"Blackbelt","standardNextRankId":"JET_BLACK_RED_STAR_1","eliteEligible":false,"image":"jet_black.png","eliteImage":""},{"order":34,"id":"JET_BLACK_RED_STAR_1","name":"Jet Black Belt (Red Star)","category":"Blackbelt","standardNextRankId":"JET_BLACK_RED_STAR_2","eliteEligible":false,"image":"jet_black_red_star_1.png","eliteImage":""},{"order":35,"id":"JET_BLACK_RED_STAR_2","name":"Jet Black Belt (2 Red Stars)","category":"Blackbelt","standardNextRankId":"JET_BLACK_RED_STAR_3","eliteEligible":false,"image":"jet_black_red_star_2.png","eliteImage":""},{"order":36,"id":"JET_BLACK_RED_STAR_3","name":"Jet Black Belt (3 Red Stars)","category":"Blackbelt","standardNextRankId":"JET_BLACK_GOLD_STAR_1","eliteEligible":false,"image":"jet_black_red_star_3.png","eliteImage":""},{"order":37,"id":"JET_BLACK_GOLD_STAR_1","name":"Jet Black Belt (Gold Star)","category":"Blackbelt","standardNextRankId":"JET_BLACK_GOLD_STAR_2","eliteEligible":false,"image":"jet_black_gold_star_1.png","eliteImage":""},{"order":38,"id":"JET_BLACK_GOLD_STAR_2","name":"Jet Black Belt (2 Gold Stars)","category":"Blackbelt","standardNextRankId":"JET_BLACK_GOLD_STAR_3","eliteEligible":false,"image":"jet_black_gold_star_2.png","eliteImage":""},{"order":39,"id":"JET_BLACK_GOLD_STAR_3","name":"Jet Black Belt (3 Gold Stars)","category":"Blackbelt","standardNextRankId":"JET_BLACK_PURPLE_STAR_1","eliteEligible":false,"image":"jet_black_gold_star_3.png","eliteImage":""},{"order":40,"id":"JET_BLACK_PURPLE_STAR_1","name":"Jet Black Belt (Purple Star)","category":"Blackbelt","standardNextRankId":"JET_BLACK_PURPLE_STAR_2","eliteEligible":false,"image":"jet_black_purple_star_1.png","eliteImage":""},{"order":41,"id":"JET_BLACK_PURPLE_STAR_2","name":"Jet Black Belt (2 Purple Stars)","category":"Blackbelt","standardNextRankId":"JET_BLACK_PURPLE_STAR_3","eliteEligible":false,"image":"jet_black_purple_star_2.png","eliteImage":""},{"order":42,"id":"JET_BLACK_PURPLE_STAR_3","name":"Jet Black Belt (3 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE","eliteEligible":false,"image":"jet_black_purple_star_3.png","eliteImage":""},{"order":43,"id":"BLACK_2_DEGREE","name":"2nd Black Belt Degree","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_RED_STAR_1","eliteEligible":false,"image":"black_2_degree.png","eliteImage":""},{"order":44,"id":"BLACK_2_DEGREE_RED_STAR_1","name":"2nd Black Belt Degree (Red Star)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_RED_STAR_2","eliteEligible":false,"image":"black_2_degree_red_star_1.png","eliteImage":""},{"order":45,"id":"BLACK_2_DEGREE_RED_STAR_2","name":"2nd Black Belt Degree (2 Red Stars)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_RED_STAR_3","eliteEligible":false,"image":"black_2_degree_red_star_2.png","eliteImage":""},{"order":46,"id":"BLACK_2_DEGREE_RED_STAR_3","name":"2nd Black Belt Degree (3 Red Stars)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_GOLD_STAR_1","eliteEligible":false,"image":"black_2_degree_red_star_3.png","eliteImage":""},{"order":47,"id":"BLACK_2_DEGREE_GOLD_STAR_1","name":"2nd Black Belt Degree (Gold Star)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_GOLD_STAR_2","eliteEligible":false,"image":"black_2_degree_gold_star_1.png","eliteImage":""},{"order":48,"id":"BLACK_2_DEGREE_GOLD_STAR_2","name":"2nd Black Belt Degree (2 Gold Stars)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_GOLD_STAR_3","eliteEligible":false,"image":"black_2_degree_gold_star_2.png","eliteImage":""},{"order":49,"id":"BLACK_2_DEGREE_GOLD_STAR_3","name":"2nd Black Belt Degree (3 Gold Stars)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_PURPLE_STAR_1","eliteEligible":false,"image":"black_2_degree_gold_star_3.png","eliteImage":""},{"order":50,"id":"BLACK_2_DEGREE_PURPLE_STAR_1","name":"2nd Black Belt Degree (Purple Star)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_PURPLE_STAR_2","eliteEligible":false,"image":"black_2_degree_purple_star_1.png","eliteImage":""},{"order":51,"id":"BLACK_2_DEGREE_PURPLE_STAR_2","name":"2nd Black Belt Degree (2 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_2_DEGREE_PURPLE_STAR_3","eliteEligible":false,"image":"black_2_degree_purple_star_2.png","eliteImage":""},{"order":52,"id":"BLACK_2_DEGREE_PURPLE_STAR_3","name":"2nd Black Belt Degree (3 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI","eliteEligible":false,"image":"black_2_degree_purple_star_3.png","eliteImage":""},{"order":53,"id":"BLACK_3_SENPAI","name":"3rd Black Belt Degree Rank of Senpai","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_RED_STAR_1","eliteEligible":false,"image":"black_3_senpai.png","eliteImage":""},{"order":54,"id":"BLACK_3_SENPAI_RED_STAR_1","name":"3rd Black Belt Degree Rank of Senpai (Red Star)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_RED_STAR_2","eliteEligible":false,"image":"black_3_senpai_red_star_1.png","eliteImage":""},{"order":55,"id":"BLACK_3_SENPAI_RED_STAR_2","name":"3rd Black Belt Degree Rank of Senpai (2 Red Stars)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_RED_STAR_3","eliteEligible":false,"image":"black_3_senpai_red_star_2.png","eliteImage":""},{"order":56,"id":"BLACK_3_SENPAI_RED_STAR_3","name":"3rd Black Belt Degree Rank of Senpai (3 Red Stars)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_GOLD_STAR_1","eliteEligible":false,"image":"black_3_senpai_red_star_3.png","eliteImage":""},{"order":57,"id":"BLACK_3_SENPAI_GOLD_STAR_1","name":"3rd Black Belt Degree Rank of Senpai (Gold Star)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_GOLD_STAR_2","eliteEligible":false,"image":"black_3_senpai_gold_star_1.png","eliteImage":""},{"order":58,"id":"BLACK_3_SENPAI_GOLD_STAR_2","name":"3rd Black Belt Degree Rank of Senpai (2 Gold Stars)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_GOLD_STAR_3","eliteEligible":false,"image":"black_3_senpai_gold_star_2.png","eliteImage":""},{"order":59,"id":"BLACK_3_SENPAI_GOLD_STAR_3","name":"3rd Black Belt Degree Rank of Senpai (3 Gold Stars)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_PURPLE_STAR_1","eliteEligible":false,"image":"black_3_senpai_gold_star_3.png","eliteImage":""},{"order":60,"id":"BLACK_3_SENPAI_PURPLE_STAR_1","name":"3rd Black Belt Degree Rank of Senpai (Purple Star)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_PURPLE_STAR_2","eliteEligible":false,"image":"black_3_senpai_purple_star_1.png","eliteImage":""},{"order":61,"id":"BLACK_3_SENPAI_PURPLE_STAR_2","name":"3rd Black Belt Degree Rank of Senpai (2 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_3_SENPAI_PURPLE_STAR_3","eliteEligible":false,"image":"black_3_senpai_purple_star_2.png","eliteImage":""},{"order":62,"id":"BLACK_3_SENPAI_PURPLE_STAR_3","name":"3rd Black Belt Degree Rank of Senpai (3 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI","eliteEligible":false,"image":"black_3_senpai_purple_star_3.png","eliteImage":""},{"order":63,"id":"BLACK_4_SENSEI","name":"4th Black Belt Degree Rank of Sensei","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_RED_STAR_1","eliteEligible":false,"image":"black_4_sensei.png","eliteImage":""},{"order":64,"id":"BLACK_4_SENSEI_RED_STAR_1","name":"4th Black Belt Degree Rank of Sensei (Red Star)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_RED_STAR_2","eliteEligible":false,"image":"black_4_sensei_red_star_1.png","eliteImage":""},{"order":65,"id":"BLACK_4_SENSEI_RED_STAR_2","name":"4th Black Belt Degree Rank of Sensei (2 Red Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_RED_STAR_3","eliteEligible":false,"image":"black_4_sensei_red_star_2.png","eliteImage":""},{"order":66,"id":"BLACK_4_SENSEI_RED_STAR_3","name":"4th Black Belt Degree Rank of Sensei (3 Red Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_GOLD_STAR_1","eliteEligible":false,"image":"black_4_sensei_red_star_3.png","eliteImage":""},{"order":67,"id":"BLACK_4_SENSEI_GOLD_STAR_1","name":"4th Black Belt Degree Rank of Sensei (Gold Star)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_GOLD_STAR_2","eliteEligible":false,"image":"black_4_sensei_gold_star_1.png","eliteImage":""},{"order":68,"id":"BLACK_4_SENSEI_GOLD_STAR_2","name":"4th Black Belt Degree Rank of Sensei (2 Gold Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_GOLD_STAR_3","eliteEligible":false,"image":"black_4_sensei_gold_star_2.png","eliteImage":""},{"order":69,"id":"BLACK_4_SENSEI_GOLD_STAR_3","name":"4th Black Belt Degree Rank of Sensei (3 Gold Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_PURPLE_STAR_1","eliteEligible":false,"image":"black_4_sensei_gold_star_3.png","eliteImage":""},{"order":70,"id":"BLACK_4_SENSEI_PURPLE_STAR_1","name":"4th Black Belt Degree Rank of Sensei (Purple Star)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_PURPLE_STAR_2","eliteEligible":false,"image":"black_4_sensei_purple_star_1.png","eliteImage":""},{"order":71,"id":"BLACK_4_SENSEI_PURPLE_STAR_2","name":"4th Black Belt Degree Rank of Sensei (2 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_SENSEI_PURPLE_STAR_3","eliteEligible":false,"image":"black_4_sensei_purple_star_2.png","eliteImage":""},{"order":72,"id":"BLACK_4_SENSEI_PURPLE_STAR_3","name":"4th Black Belt Degree Rank of Sensei (3 Purple Stars)","category":"Blackbelt","standardNextRankId":"BLACK_4_RENSHI","eliteEligible":false,"image":"black_4_sensei_purple_star_3.png","eliteImage":""},{"order":73,"id":"BLACK_4_RENSHI","name":"4th Degree Blackbelt (Rank of Sensei) Renshi Belt","category":"Blackbelt","standardNextRankId":"BLACK_5_SENSEI","eliteEligible":false,"image":"black_4_renshi.png","eliteImage":""},{"order":74,"id":"BLACK_5_SENSEI","name":"5th Degree Blackbelt (Rank of Sensei)","category":"Blackbelt","standardNextRankId":"BLACK_6_SHIHAN","eliteEligible":false,"image":"black_5_sensei.png","eliteImage":""},{"order":75,"id":"BLACK_6_SHIHAN","name":"6th Degree Blackbelt (Rank of Shihan)","category":"Blackbelt","standardNextRankId":"BLACK_7_SHIHAN","eliteEligible":false,"image":"black_6_shihan.png","eliteImage":""},{"order":76,"id":"BLACK_7_SHIHAN","name":"7th Degree Blackbelt (Rank of Shihan)","category":"Blackbelt","standardNextRankId":"BLACK_8_SHIHAN","eliteEligible":false,"image":"black_7_shihan.png","eliteImage":""},{"order":77,"id":"BLACK_8_SHIHAN","name":"8th Degree Blackbelt (Rank of Shihan)","category":"Blackbelt","standardNextRankId":"BLACK_9_PROFESSOR","eliteEligible":false,"image":"black_8_shihan.png","eliteImage":""},{"order":78,"id":"BLACK_9_PROFESSOR","name":"9th Degree Blackbelt (Rank of Professor)","category":"Blackbelt","standardNextRankId":"BLACK_10_GRANDMASTER","eliteEligible":false,"image":"black_9_professor.png","eliteImage":""},{"order":79,"id":"BLACK_10_GRANDMASTER","name":"10th Degree Blackbelt (Rank of Grandmaster)","category":"Blackbelt","standardNextRankId":"","eliteEligible":false,"image":"black_10_grandmaster.png","eliteImage":""}];
  let editingStudent = null;
  let promotionStudents = [];
  let initializationStudents = [];
  let dashboardBaseResult = null;

  const $ = id => document.getElementById(id);

  function show(id) {
    document.body.classList.add('admin-mode');
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    $(id).classList.add('active');
  }

  function todayKey() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  function daysAgoKey(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  const ADMIN_RETRY_DELAYS = [0, 1500, 4000];

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function friendlyAdminError(err) {
    const message = String(err && err.message ? err.message : err || '');

    if (/failed to fetch|networkerror|load failed/i.test(message)) {
      return 'Could not reach Google Apps Script. Check your connection and try again.';
    }

    if (/unexpected html|returned an html|doctype|not valid json/i.test(message)) {
      return 'Google Apps Script returned a temporary web page instead of app data. Please try again.';
    }

    if (/timed out|timeout|aborterror/i.test(message)) {
      return 'Google Apps Script is taking longer than expected. Please try again.';
    }

    return message || 'Admin request failed. Please try again.';
  }

  function isRetryableAdminError(err) {
    if (!err) return false;
    if (err.retryable === true) return true;
    const message = String(err.message || err);
    return /failed to fetch|networkerror|load failed|unexpected html|returned an html|doctype|timed out|timeout|aborterror/i.test(message);
  }

  async function fetchAdminAttempt(action, data) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(window.PD_CONFIG.API_URL, {
        method: 'POST',
        redirect: 'follow',
        cache: 'no-store',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'adminAction',
          adminAction: action,
          adminPin,
          data
        }),
        signal: controller.signal
      });

      const text = await response.text();
      const trimmed = text.trim();
      const contentType = String(response.headers.get('content-type') || '').toLowerCase();
      const looksHtml = /^<!doctype html/i.test(trimmed) || /^<html/i.test(trimmed) || contentType.includes('text/html');

      if (looksHtml) {
        const err = new Error('Google Apps Script returned an HTML page instead of JSON.');
        err.retryable = true;
        err.status = response.status;
        throw err;
      }

      if (!response.ok) {
        const err = new Error(`Google Apps Script returned HTTP ${response.status}.`);
        err.retryable = [408, 429, 500, 502, 503, 504].includes(response.status);
        err.status = response.status;
        throw err;
      }

      let result;
      try {
        result = JSON.parse(trimmed);
      } catch (parseErr) {
        const err = new Error('Google Apps Script returned a response that was not valid JSON.');
        err.retryable = true;
        throw err;
      }

      if (!result || result.success !== true) {
        throw new Error(result && result.message ? result.message : 'Admin request failed.');
      }

      return result;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function api(action, data = {}) {
    if (!window.PD_CONFIG || !window.PD_CONFIG.API_URL) {
      throw new Error('Apps Script API URL is not configured.');
    }

    if (!navigator.onLine) {
      throw new Error('Admin functions require an internet connection.');
    }

    let lastError = null;

    for (let attempt = 0; attempt < ADMIN_RETRY_DELAYS.length; attempt++) {
      if (ADMIN_RETRY_DELAYS[attempt]) {
        await sleep(ADMIN_RETRY_DELAYS[attempt]);
      }

      try {
        return await fetchAdminAttempt(action, data);
      } catch (err) {
        lastError = err;
        console.warn(`Admin API ${action} attempt ${attempt + 1} failed`, err);

        if (!isRetryableAdminError(err) || attempt === ADMIN_RETRY_DELAYS.length - 1) {
          break;
        }
      }
    }

    throw new Error(friendlyAdminError(lastError));
  }

  function message(id, text = '') {
    const el = $(id);
    if (!el) return;
    el.textContent = text;
  }

  function retryMessage(id, text, retryFn) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = '';

    const span = document.createElement('span');
    span.textContent = text;
    el.appendChild(span);

    if (typeof retryFn === 'function') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'inline-retry-btn';
      btn.textContent = 'Retry';
      btn.addEventListener('click', retryFn);
      el.appendChild(btn);
    }
  }

  function backHome() {
    adminPin = '';
    document.body.classList.remove('admin-mode');
    if (typeof window !== 'undefined') {
      document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
      $('pinScreen').classList.add('active');
    }
  }

  async function openAdminLogin() {
    $('adminPinInput').value = '';
    message('adminLoginMessage', navigator.onLine ? '' : 'Admin functions require internet.');
    show('adminLoginScreen');
    setTimeout(() => $('adminPinInput').focus(), 50);
  }

  async function verifyAdmin() {
    const candidate = $('adminPinInput').value.trim();

    if (!candidate) {
      message('adminLoginMessage', 'Enter the Admin PIN.');
      return;
    }

    adminPin = candidate;
    message('adminLoginMessage', 'Checking…');

    try {
      await api('verify');
      message('adminLoginMessage', '');
      show('adminHubScreen');
    } catch (err) {
      adminPin = '';
      message('adminLoginMessage', err.message);
    }
  }

  async function addStudent() {
    const name = $('newStudentName').value.trim();
    if (!name) {
      message('addStudentMessage', 'Enter the student name.');
      return;
    }

    try {
      const result = await api('addStudent', { name });
      message('addStudentMessage', `${result.name} added. Number: ${result.pin}`);
      $('newStudentName').value = '';
      if (window.PDSyncNow) {
        window.PDSyncNow().catch(console.error);
      }
    } catch (err) {
      message('addStudentMessage', err.message);
    }
  }

  function renderMemberResults(boxId, matches, actionLabel, actionClass, handler) {
    const box = $(boxId);
    box.innerHTML = '';

    matches.forEach(member => {
      const row = document.createElement('div');
      row.className = 'admin-list-row';

      const info = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = member.name;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `Number ${member.pin}`;
      info.append(name, meta);

      const btn = document.createElement('button');
      btn.className = `result-action ${actionClass || ''}`.trim();
      btn.textContent = actionLabel;
      btn.addEventListener('click', () => handler(member));

      row.append(info, btn);
      box.appendChild(row);
    });
  }

  async function searchDeactivate() {
    const term = $('deactivateSearch').value.trim();
    if (!term) return;

    try {
      const result = await api('searchDeactivate', { term });
      message('deactivateMessage', '');
      renderMemberResults(
        'deactivateResults',
        result.matches,
        'Deactivate',
        '',
        async member => {
          if (!confirm(`Deactivate ${member.name} (${member.pin})?`)) return;
          try {
            const r = await api('deactivate', { pin: member.pin });
            message('deactivateMessage', r.message);
            if (window.PDSyncNow) window.PDSyncNow().catch(console.error);
            searchDeactivate();
          } catch (err) {
            message('deactivateMessage', err.message);
          }
        }
      );
    } catch (err) {
      $('deactivateResults').innerHTML = '';
      message('deactivateMessage', err.message);
    }
  }

  async function searchReactivate() {
    const term = $('reactivateSearch').value.trim();
    if (!term) return;

    try {
      const result = await api('searchReactivate', { term });
      message('reactivateMessage', '');
      renderMemberResults(
        'reactivateResults',
        result.matches,
        'Reactivate',
        'reactivate',
        async member => {
          if (!confirm(`Reactivate ${member.name} (${member.pin})?`)) return;
          try {
            const r = await api('reactivate', { pin: member.pin });
            message('reactivateMessage', r.message);
            if (window.PDSyncNow) window.PDSyncNow().catch(console.error);
            searchReactivate();
          } catch (err) {
            message('reactivateMessage', err.message);
          }
        }
      );
    } catch (err) {
      $('reactivateResults').innerHTML = '';
      message('reactivateMessage', err.message);
    }
  }

  async function loadToday() {
    show('adminTodayScreen');
    const box = $('todaySigninsList');
    box.innerHTML = '';
    message('todaySigninsMessage', 'Loading…');

    try {
      const result = await api('todaySignins');
      message('todaySigninsMessage', '');

      result.entries.forEach(entry => {
        const row = document.createElement('div');
        row.className = 'admin-list-row';

        const left = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = entry.name;
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `Number ${entry.pin}`;
        left.append(name, meta);

        const actions = document.createElement('div');
        actions.className = 'today-entry-actions';

        const time = document.createElement('span');
        time.textContent = entry.time;

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'today-delete';
        del.textContent = 'Delete';
        del.addEventListener('click', async () => {
          if (!confirm(`Delete today's sign-in for ${entry.name} (${entry.pin})?`)) {
            return;
          }

          del.disabled = true;

          try {
            const deleted = await api('deleteTodaySignIn', { pin: entry.pin });

            // Also remove the same day's local PWA record, if it exists,
            // so the student can sign in again on this device.
            if (
              window.PDDB &&
              typeof window.PDDB.deleteAttendanceForPinDate === 'function'
            ) {
              await window.PDDB.deleteAttendanceForPinDate(
                entry.pin,
                todayKey()
              );
            }

            message('todaySigninsMessage', deleted.message || 'Sign-in deleted.');
            await loadToday();
          } catch (err) {
            message('todaySigninsMessage', err.message);
            del.disabled = false;
          }
        });

        actions.append(time, del);
        row.append(left, actions);
        box.appendChild(row);
      });

    } catch (err) {
      box.innerHTML = '';
      message('todaySigninsMessage', err.message);
    }
  }

  async function loadCatchup() {
    const date = $('catchupDate').value;
    const box = $('catchupResults');
    box.innerHTML = '';
    $('submitCatchupBtn').style.display = 'none';

    try {
      const result = await api('catchupList', { date });

      if (!result.students.length) {
        message('catchupMessage', `Everyone is already signed in for ${result.dateLabel}.`);
        return;
      }

      message('catchupMessage', `${result.count} student(s) not signed in for ${result.dateLabel}.`);

      result.students.forEach(student => {
        const label = document.createElement('label');
        label.className = 'check-row';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = student.pin;

        const text = document.createElement('span');
        text.textContent = `${student.name} — ${student.pin}`;

        label.append(checkbox, text);
        box.appendChild(label);
      });

      $('submitCatchupBtn').style.display = '';
    } catch (err) {
      message('catchupMessage', err.message);
    }
  }

  async function submitCatchup() {
    const pins = Array.from(
      document.querySelectorAll('#catchupResults input[type="checkbox"]:checked')
    ).map(el => el.value);

    if (!pins.length) {
      message('catchupMessage', 'Select at least one student.');
      return;
    }

    try {
      const result = await api('catchupSubmit', {
        date: $('catchupDate').value,
        pins
      });
      message('catchupMessage', result.message || `${result.count || pins.length} attendance record(s) added.`);
      await loadCatchup();
    } catch (err) {
      message('catchupMessage', err.message);
    }
  }

  let dashboardStudentFilter = '';

  function parseLocalDateKey(key) {
    const parts = String(key || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  }

  function formatDashboardDate(key, includeYear = false) {
    const d = parseLocalDateKey(key);
    if (!d) return key;

    return d.toLocaleDateString(
      undefined,
      includeYear
        ? { month: 'short', day: 'numeric', year: 'numeric' }
        : { month: 'short', day: 'numeric' }
    );
  }

  function renderDashboardChart(result) {
    const box = $('attendanceChart');
    box.innerHTML = '';

    const rows = Array.isArray(result.chartRows) ? result.chartRows : [];

    if (!rows.length) {
      box.textContent = 'No chart data for this range.';
      return;
    }

    const width = 720;
    const height = 245;
    const pad = { left: 42, right: 14, top: 16, bottom: 45 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    const maxCount = Math.max(1, ...rows.map(r => Number(r.count) || 0));
    const yMax = Math.max(4, Math.ceil(maxCount / 4) * 4);

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute(
      'aria-label',
      dashboardStudentFilter
        ? `Daily attendance for ${dashboardStudentFilter}`
        : 'Daily attendance'
    );

    function el(name, attrs = {}, text = '') {
      const node = document.createElementNS(ns, name);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      if (text !== '') node.textContent = text;
      return node;
    }

    // Horizontal grid and Y labels.
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (plotH * i / 4);
      const value = Math.round(yMax * (1 - i / 4));

      svg.appendChild(el('line', {
        x1: pad.left,
        y1: y,
        x2: width - pad.right,
        y2: y,
        class: 'chart-grid'
      }));

      svg.appendChild(el('text', {
        x: pad.left - 8,
        y: y + 4,
        'text-anchor': 'end',
        class: 'chart-y-label'
      }, String(value)));
    }

    svg.appendChild(el('line', {
      x1: pad.left,
      y1: pad.top,
      x2: pad.left,
      y2: height - pad.bottom,
      class: 'chart-axis'
    }));

    svg.appendChild(el('line', {
      x1: pad.left,
      y1: height - pad.bottom,
      x2: width - pad.right,
      y2: height - pad.bottom,
      class: 'chart-axis'
    }));

    const crossesYear =
      result.startDate &&
      result.endDate &&
      String(result.startDate).slice(0, 4) !== String(result.endDate).slice(0, 4);

    const points = rows.map((row, i) => {
      const x = rows.length === 1
        ? pad.left + plotW / 2
        : pad.left + (plotW * i / (rows.length - 1));
      const count = Number(row.count) || 0;
      const y = pad.top + plotH - (count / yMax) * plotH;
      return { x, y, count, date: row.date };
    });

    svg.appendChild(el('polyline', {
      points: points.map(p => `${p.x},${p.y}`).join(' '),
      class: 'chart-line'
    }));

    points.forEach(point => {
      const circle = el('circle', {
        cx: point.x,
        cy: point.y,
        r: 4,
        class: 'chart-point'
      });
      const title = el(
        'title',
        {},
        `${formatDashboardDate(point.date, true)}: ${point.count} sign-in${point.count === 1 ? '' : 's'}`
      );
      circle.appendChild(title);
      svg.appendChild(circle);
    });

    const labelEvery =
      rows.length <= 14 ? 1 : Math.ceil(rows.length / 7);

    points.forEach((point, i) => {
      if (
        i !== 0 &&
        i !== points.length - 1 &&
        i % labelEvery !== 0
      ) {
        return;
      }

      svg.appendChild(el('text', {
        x: point.x,
        y: height - pad.bottom + 19,
        'text-anchor': 'middle',
        class: 'chart-label'
      }, formatDashboardDate(point.date, crossesYear)));
    });

    box.appendChild(svg);
  }

  function renderDashboardStudentList(result) {
    const box = $('dashboardTable');
    box.innerHTML = '';

    const rows = Array.isArray(result.studentRows) ? result.studentRows : [];

    if (!rows.length) {
      box.textContent = 'No students attended during this range.';
      return;
    }

    rows.forEach(student => {
      const row = document.createElement('div');
      row.className = 'admin-list-row';
      row.tabIndex = 0;

      const left = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = student.name;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = student.pin
        ? `Number ${student.pin}`
        : 'Historical attendance';
      left.append(name, meta);

      const count = document.createElement('span');
      const days = Number(student.daysAttended) || 0;
      count.textContent = `${days} day${days === 1 ? '' : 's'}`;

      const applyFilter = () => {
        if (!dashboardBaseResult) return;
        dashboardStudentFilter = student.name;
        renderDashboardResult(filteredDashboardResult(dashboardBaseResult, student.name));
      };

      row.addEventListener('click', applyFilter);
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applyFilter();
        }
      });

      row.append(left, count);
      box.appendChild(row);
    });
  }

  function filteredDashboardResult(base, studentName) {
    if (!base || !studentName) return base;

    const selected = (base.studentRows || []).find(row => row.name === studentName);
    if (!selected) return base;

    const dateCounts = selected.dateCounts || {};
    const chartRows = (base.chartRows || []).map(point => ({
      date: point.date,
      count: Number(dateCounts[point.date] || 0)
    }));

    let totalLogins = 0;
    let activeDays = 0;
    let busiestDay = '';
    let busiestDayCount = 0;

    chartRows.forEach(point => {
      totalLogins += point.count;
      if (point.count > 0) activeDays++;
      if (point.count > busiestDayCount) {
        busiestDayCount = point.count;
        busiestDay = point.date;
      }
    });

    return {
      ...base,
      chartRows,
      metrics: {
        totalLogins,
        uniqueStudents: totalLogins > 0 ? 1 : 0,
        activeDays,
        averagePerActiveDay: activeDays ? Math.round((totalLogins / activeDays) * 10) / 10 : 0,
        busiestDay,
        busiestDayCount
      },
      studentFilter: studentName
    };
  }

  function renderDashboardResult(result) {
    const metrics = result.metrics || {};
    const busiest = metrics.busiestDay
      ? `${formatDashboardDate(metrics.busiestDay)} (${metrics.busiestDayCount})`
      : '—';

    $('dashboardSummary').innerHTML = '';
    $('dashboardTable').innerHTML = '';
    $('attendanceChart').innerHTML = '';

    const cards = [
      ['Total Sign-ins', metrics.totalLogins ?? 0],
      ['Unique Students', metrics.uniqueStudents ?? 0],
      ['Avg / Active Day', metrics.averagePerActiveDay ?? 0],
      ['Busiest Day', busiest]
    ];

    cards.forEach(([label, value]) => {
      const card = document.createElement('div');
      card.className = 'metric-card';
      const strong = document.createElement('strong');
      strong.textContent = String(value);
      const span = document.createElement('span');
      span.textContent = label;
      card.append(strong, span);
      $('dashboardSummary').appendChild(card);
    });

    if (dashboardStudentFilter) {
      $('dashboardSelectedStudentName').textContent = dashboardStudentFilter;
      $('dashboardSelectedStudent').style.display = 'flex';
    } else {
      $('dashboardSelectedStudent').style.display = 'none';
    }

    renderDashboardChart(result);
    renderDashboardStudentList(result);
  }

  async function loadDashboard() {
    const start = $('dashboardStart').value;
    const end = $('dashboardEnd').value;

    if (!start || !end) {
      message('dashboardMessage', 'Choose a date range, then tap Show Report.');
      return;
    }

    message('dashboardMessage', 'Loading attendance data…');
    $('loadDashboardBtn').disabled = true;
    $('dashboardSummary').innerHTML = '';
    $('dashboardTable').innerHTML = '';
    $('attendanceChart').innerHTML = '';

    try {
      const result = await api('dashboard', { start, end, student: '' });
      dashboardBaseResult = result;
      dashboardStudentFilter = '';
      message('dashboardMessage', '');
      renderDashboardResult(result);
    } catch (err) {
      retryMessage('dashboardMessage', err.message, loadDashboard);
    } finally {
      $('loadDashboardBtn').disabled = false;
    }
  }

  function setDashboardRange(kind) {
    const end = new Date();
    const start = new Date(end);

    if (kind === 'today') {
      // no change
    } else if (kind === '7') {
      start.setDate(end.getDate() - 6);
    } else if (kind === '30') {
      start.setDate(end.getDate() - 29);
    } else if (kind === 'week') {
      const day = end.getDay();
      const daysSinceMonday = (day + 6) % 7;
      start.setDate(end.getDate() - daysSinceMonday);
    } else if (kind === 'month') {
      start.setDate(1);
    }

    function key(d) {
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
      ].join('-');
    }

    $('dashboardStart').value = key(start);
    $('dashboardEnd').value = key(end);
    loadDashboard();
  }

  async function downloadCsv() {
    try {
      message('csvMessage', 'Preparing…');
      const result = await api('csv', {
        start: $('csvStart').value,
        end: $('csvEnd').value
      });

      const blob = new Blob([result.csvData], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename || 'attendance.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      message('csvMessage', 'CSV downloaded.');
    } catch (err) {
      message('csvMessage', err.message);
    }
  }

  async function openSheet() {
    try {
      const result = await api('sheetUrl');
      window.open(result.url, '_blank', 'noopener');
    } catch (err) {
      message('adminSettingsMessage', err.message);
    }
  }


  function rankById(rankId) {
    return beltRanks.find(rank => rank.id === rankId) || null;
  }

  function beltImageFor(rankId, elite) {
    const rank = rankById(rankId);
    if (!rank) return '';
    if (elite && rank.eliteEligible && rank.eliteImage) return rank.eliteImage;
    return rank.image || '';
  }

  function beltLabelFor(rankId, elite) {
    const rank = rankById(rankId);
    if (!rank) return 'Rank not set';
    return rank.name + (elite ? ' — Elite' : '');
  }

  async function ensureRanksLoaded() {
    return beltRanks;
  }

  function populateRankSelect(select, selectedId, allowBlank = true) {
    select.innerHTML = '';

    if (allowBlank) {
      const blank = document.createElement('option');
      blank.value = '';
      blank.textContent = '— Rank not set —';
      select.appendChild(blank);
    }

    beltRanks.forEach(rank => {
      const option = document.createElement('option');
      option.value = rank.id;
      option.textContent = rank.name;
      if (rank.id === selectedId) option.selected = true;
      select.appendChild(option);
    });
  }

  function updateStudentBeltPreview() {
    const rankId = $('editStudentRank').value;
    const rank = rankById(rankId);
    const eliteBox = $('editStudentElite');

    if (!rank) {
      eliteBox.checked = false;
      eliteBox.disabled = true;
      $('editStudentBeltPreview').hidden = true;
      return;
    }

    eliteBox.disabled = !rank.eliteEligible;
    if (!rank.eliteEligible) eliteBox.checked = false;

    const file = beltImageFor(rankId, eliteBox.checked);
    if (file) {
      const image = $('editStudentBeltImage');
      const embedded = window.PD_BELT_IMAGE_DATA && window.PD_BELT_IMAGE_DATA[file];
      image.onerror = () => {
        image.removeAttribute('src');
        $('editStudentBeltPreview').hidden = true;
      };
      image.src = embedded || `./belts/${file}`;
      image.alt = '';
      $('editStudentBeltName').textContent = beltLabelFor(rankId, eliteBox.checked);
      $('editStudentBeltPreview').hidden = false;
    } else {
      $('editStudentBeltPreview').hidden = true;
    }
  }

  async function openManageStudents() {
    show('adminManageStudentsScreen');
    message('manageStudentMessage', '');
    $('manageStudentResults').innerHTML = '';
    await searchManageStudents();
  }

  async function searchManageStudents() {
    message('manageStudentMessage', 'Loading…');
    $('manageStudentResults').innerHTML = '';

    try {
      await ensureRanksLoaded();
      const result = await api('searchStudents', {
        term: $('manageStudentSearch').value.trim()
      });
      message('manageStudentMessage', result.matches.length ? '' : 'No matching students.');

      result.matches.forEach(student => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'search-result student-manage-result';
        row.dataset.pin = student.pin;

        const left = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = student.name;
        const meta = document.createElement('span');
        meta.className = 'student-result-rank';
        meta.textContent = `#${student.pin} · ${student.rankName || 'Rank not set'}${student.elite ? ' · Elite' : ''} · ${student.active ? 'Active' : 'Inactive'} · Base ${student.baseDays}`;
        left.append(name, meta);

        row.appendChild(left);
        row.addEventListener('click', () => openStudentEditor(student));
        $('manageStudentResults').appendChild(row);
      });
    } catch (err) {
      retryMessage('manageStudentMessage', err.message, searchManageStudents);
    }
  }

  async function openStudentEditor(student) {
    // searchStudents already returns the complete editable student record.
    // Reusing it here removes a second Apps Script request just to reopen the
    // same row the server returned moments earlier.
    if (!student || !student.pin) return;

    editingStudent = { ...student };
    await ensureRanksLoaded();

    $('editStudentPin').textContent = editingStudent.pin;
    $('editStudentName').value = editingStudent.name;
    $('editStudentBaseDays').value = editingStudent.baseDays ?? 0;
    $('editStudentActive').checked = editingStudent.active !== false;
    populateRankSelect($('editStudentRank'), editingStudent.rankId || '', true);
    $('editStudentElite').checked = Boolean(editingStudent.elite);
    updateStudentBeltPreview();
    message('manageStudentMessage', '');
    message('editStudentMessage', '');
    show('adminStudentEditScreen');
  }

  async function saveStudent() {
    if (!editingStudent) return;

    const rankId = $('editStudentRank').value;
    const rank = rankById(rankId);
    const next = {
      pin: editingStudent.pin,
      name: $('editStudentName').value.trim(),
      baseDays: Number($('editStudentBaseDays').value || 0),
      active: $('editStudentActive').checked,
      rankId,
      elite: Boolean(rank && rank.eliteEligible && $('editStudentElite').checked)
    };

    if (!next.name) {
      message('editStudentMessage', 'Name cannot be blank.');
      return;
    }
    if (!Number.isFinite(next.baseDays) || next.baseDays < 0 || !Number.isInteger(next.baseDays)) {
      message('editStudentMessage', 'Base days must be a whole number of 0 or greater.');
      return;
    }

    const changes = [];
    if (next.name !== editingStudent.name) changes.push(`Name: ${editingStudent.name} → ${next.name}`);
    if (next.baseDays !== Number(editingStudent.baseDays || 0)) changes.push(`Base days: ${editingStudent.baseDays || 0} → ${next.baseDays}`);
    if (next.active !== Boolean(editingStudent.active)) changes.push(`Active: ${editingStudent.active ? 'Yes' : 'No'} → ${next.active ? 'Yes' : 'No'}`);
    if (next.rankId !== (editingStudent.rankId || '') || next.elite !== Boolean(editingStudent.elite)) {
      changes.push(`Rank: ${beltLabelFor(editingStudent.rankId, editingStudent.elite)} → ${beltLabelFor(next.rankId, next.elite)}`);
    }

    if (!changes.length) {
      message('editStudentMessage', 'No changes to save.');
      return;
    }

    if (!confirm(`Save these changes?\n\n${changes.join('\n')}`)) return;

    try {
      const result = await api('updateStudent', next);
      editingStudent = result.student;
      message('editStudentMessage', 'Changes saved.');
      if (window.PDSyncNow) await window.PDSyncNow().catch(console.error);
      setTimeout(() => searchManageStudents().catch(console.error), 150);
    } catch (err) {
      message('editStudentMessage', err.message);
    }
  }

  function promotionTargetOptions(select, selectedId) {
    populateRankSelect(select, selectedId, true);
  }

  function updatePromotionEliteState(row, student) {
    const select = row.querySelector('.promotion-target-select');
    const elite = row.querySelector('.promotion-elite');
    const rank = rankById(select.value);
    elite.disabled = !rank || !rank.eliteEligible;
    if (elite.disabled) elite.checked = false;
  }

  function renderPromotionCandidates(students) {
    const box = $('promotionCandidates');
    box.innerHTML = '';

    if (!students.length) {
      box.textContent = 'No matching active students.';
      return;
    }

    students.forEach(student => {
      const row = document.createElement('div');
      row.className = 'promotion-row';
      row.dataset.pin = student.pin;

      const pick = document.createElement('input');
      pick.type = 'checkbox';
      pick.className = 'promotion-checkbox';
      pick.checked = Boolean(student.attended);

      const fields = document.createElement('div');
      fields.className = 'promotion-fields';

      const name = document.createElement('strong');
      name.textContent = student.name;

      const current = document.createElement('div');
      current.className = 'promotion-current';
      current.textContent = `#${student.pin} · Current: ${student.rankName || 'Rank not set'}${student.elite ? ' — Elite' : ''}${student.attended ? ' · Attended exam date' : ''}`;

      const override = document.createElement('div');
      override.className = 'promotion-override';

      const select = document.createElement('select');
      select.className = 'promotion-target-select';
      promotionTargetOptions(select, student.standardNextRankId || '');

      const eliteLabel = document.createElement('label');
      eliteLabel.className = 'check-inline';
      const elite = document.createElement('input');
      elite.type = 'checkbox';
      elite.className = 'promotion-elite';
      eliteLabel.append(elite, document.createTextNode(' Elite belt'));

      override.append(select, eliteLabel);
      fields.append(name, current, override);
      row.append(pick, fields);
      box.appendChild(row);

      select.addEventListener('change', () => updatePromotionEliteState(row, student));
      updatePromotionEliteState(row, student);
    });
  }

  async function openBeltPromotions() {
    show('adminBeltPromotionsScreen');
    $('promotionExamDate').value = todayKey();
    message('promotionMessage', '');
    try {
      await ensureRanksLoaded();
      await loadPromotionCandidates();
    } catch (err) {
      message('promotionMessage', err.message);
    }
  }

  async function loadPromotionCandidates() {
    message('promotionMessage', 'Loading…');
    try {
      await ensureRanksLoaded();
      const result = await api('promotionCandidates', {
        term: $('promotionSearch').value.trim(),
        examDate: $('promotionExamDate').value
      });
      promotionStudents = result.students || [];
      renderPromotionCandidates(promotionStudents);
      message('promotionMessage', '');
    } catch (err) {
      $('promotionCandidates').innerHTML = '';
      message('promotionMessage', err.message);
    }
  }

  async function submitPromotions() {
    const examDate = $('promotionExamDate').value;
    const promotions = [];

    document.querySelectorAll('.promotion-row').forEach(row => {
      const checked = row.querySelector('.promotion-checkbox').checked;
      if (!checked) return;
      promotions.push({
        pin: row.dataset.pin,
        toRankId: row.querySelector('.promotion-target-select').value,
        toElite: row.querySelector('.promotion-elite').checked
      });
    });

    if (!examDate) {
      message('promotionMessage', 'Choose the exam date.');
      return;
    }
    if (!promotions.length) {
      message('promotionMessage', 'Select at least one student.');
      return;
    }
    if (promotions.some(item => !item.toRankId)) {
      message('promotionMessage', 'Every selected student must have a target rank.');
      return;
    }

    if (!confirm(`Apply ${promotions.length} belt promotion${promotions.length === 1 ? '' : 's'} for ${examDate}?`)) return;

    try {
      message('promotionMessage', 'Saving promotions…');
      const result = await api('applyPromotions', { examDate, promotions });
      message('promotionMessage', `${result.updated} promotion${result.updated === 1 ? '' : 's'} saved.`);
      if (window.PDSyncNow) await window.PDSyncNow().catch(console.error);
      await loadPromotionCandidates();
    } catch (err) {
      message('promotionMessage', err.message);
    }
  }

  async function checkForUpdate() {
    const current = (self.PD_APP_VERSION || 'unknown').toString();
    message('adminSettingsMessage', `Checking for updates… Current version: ${current}`);

    if (!navigator.onLine) {
      message('adminSettingsMessage', 'Cannot check for updates while offline.');
      return;
    }

    try {
      const versionResponse = await fetch(`./version.js?check=${Date.now()}`, { cache: 'no-store' });
      const versionText = await versionResponse.text();
      const match = versionText.match(/PD_APP_VERSION\s*=\s*['\"]([^'\"]+)['\"]/);
      const remote = match ? match[1] : '';

      if (!remote) throw new Error('Could not read the deployed app version.');

      if (remote === current) {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) await registration.update();
        }
        message('adminSettingsMessage', `App is up to date (v${current}).`);
        return;
      }

      message('adminSettingsMessage', `Version ${remote} is available. Updating…`);

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      }

      // If controllerchange does not fire quickly, reload with a cache-busting
      // navigation so the current deployment becomes visible immediately.
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('force', remote);
        window.location.replace(url.toString());
      }, 1600);
    } catch (err) {
      message('adminSettingsMessage', `Update check failed: ${err.message}`);
    }
  }

  function renderInitializationStudents(students) {
    const box = $('initializeRanksList');
    box.innerHTML = '';

    if (!students.length) {
      box.textContent = 'No active students found.';
      return;
    }

    students.forEach(student => {
      const row = document.createElement('div');
      row.className = 'promotion-row initialization-row';
      row.dataset.pin = student.pin;
      row.dataset.originalRank = student.rankId || '';
      row.dataset.originalElite = student.elite ? '1' : '0';

      const pick = document.createElement('input');
      pick.type = 'checkbox';
      pick.className = 'initialization-checkbox';

      const fields = document.createElement('div');
      fields.className = 'promotion-fields';

      const name = document.createElement('strong');
      name.textContent = student.name;

      const current = document.createElement('div');
      current.className = 'promotion-current';
      current.textContent = `#${student.pin} · Current: ${student.rankName || 'Rank not set'}${student.elite ? ' — Elite' : ''}`;

      const override = document.createElement('div');
      override.className = 'promotion-override';

      const select = document.createElement('select');
      select.className = 'initialization-rank-select';
      populateRankSelect(select, student.rankId || '', true);

      const eliteLabel = document.createElement('label');
      eliteLabel.className = 'check-inline';
      const elite = document.createElement('input');
      elite.type = 'checkbox';
      elite.className = 'initialization-elite';
      elite.checked = Boolean(student.elite);
      eliteLabel.append(elite, document.createTextNode(' Elite belt'));

      function refreshElite() {
        const rank = rankById(select.value);
        elite.disabled = !rank || !rank.eliteEligible;
        if (elite.disabled) elite.checked = false;
      }

      select.addEventListener('change', refreshElite);
      refreshElite();

      override.append(select, eliteLabel);
      fields.append(name, current, override);
      row.append(pick, fields);
      box.appendChild(row);
    });
  }

  async function openInitializeRanks() {
    show('adminInitializeRanksScreen');
    message('initializeRanksMessage', 'Loading active students…');
    try {
      await ensureRanksLoaded();
      populateRankSelect($('initializeBulkRank'), '', false);
      const result = await api('initializationStudents');
      initializationStudents = result.students || [];
      renderInitializationStudents(initializationStudents);
      message('initializeRanksMessage', `${initializationStudents.length} active students loaded.`);
    } catch (err) {
      message('initializeRanksMessage', err.message);
    }
  }

  function applyBulkInitializationRank() {
    const target = $('initializeBulkRank').value;
    if (!target) {
      message('initializeRanksMessage', 'Choose a rank to assign.');
      return;
    }
    let changed = 0;
    document.querySelectorAll('.initialization-row').forEach(row => {
      if (!row.querySelector('.initialization-checkbox').checked) return;
      const select = row.querySelector('.initialization-rank-select');
      select.value = target;
      select.dispatchEvent(new Event('change'));
      changed++;
    });
    message('initializeRanksMessage', changed ? `Assigned ${changed} checked student${changed === 1 ? '' : 's'} to ${beltLabelFor(target, false)}. Review, then Save All Changes.` : 'Check one or more students first.');
  }

  async function saveInitializedRanks() {
    const assignments = [];
    document.querySelectorAll('.initialization-row').forEach(row => {
      const rankId = row.querySelector('.initialization-rank-select').value;
      const elite = row.querySelector('.initialization-elite').checked;
      const oldRank = row.dataset.originalRank || '';
      const oldElite = row.dataset.originalElite === '1';
      if (rankId && (rankId !== oldRank || elite !== oldElite)) {
        assignments.push({ pin: row.dataset.pin, rankId, elite });
      }
    });

    if (!assignments.length) {
      message('initializeRanksMessage', 'No rank changes to save.');
      return;
    }

    if (!confirm(`Save current ranks for ${assignments.length} student${assignments.length === 1 ? '' : 's'}?`)) return;

    try {
      message('initializeRanksMessage', 'Saving current ranks…');
      const result = await api('initializeRanks', {
        effectiveDate: $('initializeEffectiveDate').value,
        assignments
      });
      message('initializeRanksMessage', `${result.updated} student rank${result.updated === 1 ? '' : 's'} initialized.`);
      if (window.PDSyncNow) await window.PDSyncNow().catch(console.error);
      await openInitializeRanks();
    } catch (err) {
      message('initializeRanksMessage', err.message);
    }
  }

  async function changePin() {
    const one = $('newAdminPin').value.trim();
    const two = $('confirmAdminPin').value.trim();

    if (!one || one !== two) {
      message('changePinMessage', 'The new PINs do not match.');
      return;
    }

    try {
      const result = await api('changePin', { newPin: one });
      adminPin = one;
      $('newAdminPin').value = '';
      $('confirmAdminPin').value = '';
      message('changePinMessage', result.message);
    } catch (err) {
      message('changePinMessage', err.message);
    }
  }

  $('adminEntryLogo').addEventListener('click', openAdminLogin);
  $('adminLoginBackBtn').addEventListener('click', backHome);
  $('adminLoginBtn').addEventListener('click', verifyAdmin);
  $('adminPinInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyAdmin();
  });

  document.querySelectorAll('[data-admin-nav]').forEach(btn => {
    btn.addEventListener('click', () => show(btn.dataset.adminNav));
  });

  document.querySelectorAll('.admin-hub-back').forEach(btn => {
    btn.addEventListener('click', () => show('adminHubScreen'));
  });

  document.querySelectorAll('.admin-back-home').forEach(btn => {
    btn.addEventListener('click', backHome);
  });

  $('addStudentBtn').addEventListener('click', addStudent);
  $('addStudentBackBtn').addEventListener('click', () => show('adminSettingsScreen'));
  $('manageStudentsTile').addEventListener('click', openManageStudents);
  $('manageStudentSearchBtn').addEventListener('click', searchManageStudents);
  $('manageStudentSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchManageStudents();
  });
  $('editStudentRank').addEventListener('change', updateStudentBeltPreview);
  $('editStudentElite').addEventListener('change', updateStudentBeltPreview);
  $('editStudentBackBtn').addEventListener('click', () => show('adminManageStudentsScreen'));
  $('saveStudentBtn').addEventListener('click', saveStudent);
  $('beltManagementTile').addEventListener('click', () => show('adminBeltManagementScreen'));
  $('beltManagementBackBtn').addEventListener('click', () => show('adminSettingsScreen'));
  $('initializeRanksTile').addEventListener('click', openInitializeRanks);
  $('initializeRanksBackBtn').addEventListener('click', () => show('adminBeltManagementScreen'));
  $('applyInitializeBulkRankBtn').addEventListener('click', applyBulkInitializationRank);
  $('saveInitializedRanksBtn').addEventListener('click', saveInitializedRanks);
  $('checkForUpdateBtn').addEventListener('click', checkForUpdate);
  $('beltPromotionsTile').addEventListener('click', openBeltPromotions);
  $('loadPromotionCandidatesBtn').addEventListener('click', loadPromotionCandidates);
  $('promotionExamDate').addEventListener('change', loadPromotionCandidates);
  $('promotionSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') loadPromotionCandidates();
  });
  $('promotionBackBtn').addEventListener('click', () => show('adminBeltManagementScreen'));
  $('submitPromotionsBtn').addEventListener('click', submitPromotions);
  $('deactivateSearchBtn').addEventListener('click', searchDeactivate);
  $('reactivateSearchBtn').addEventListener('click', searchReactivate);
  $('openReactivateBtn').addEventListener('click', () => show('adminReactivateScreen'));
  $('reactivateBackBtn').addEventListener('click', () => show('adminDeactivateScreen'));
  $('todaySigninsTile').addEventListener('click', loadToday);

  $('catchupDate').value = todayKey();
  $('loadCatchupBtn').addEventListener('click', loadCatchup);
  $('submitCatchupBtn').addEventListener('click', submitCatchup);

  $('openDashboardBtn').addEventListener('click', () => {
    dashboardStudentFilter = '';
    dashboardBaseResult = null;
    $('dashboardStart').value = daysAgoKey(29);
    $('dashboardEnd').value = todayKey();
    $('dashboardSummary').innerHTML = '';
    $('dashboardTable').innerHTML = '';
    $('attendanceChart').innerHTML = '';
    $('dashboardSelectedStudent').style.display = 'none';
    message('dashboardMessage', 'Choose a date range or shortcut, then tap Show Report.');
    show('adminDashboardScreen');
  });

  document.querySelectorAll('.dashboard-shortcut').forEach(btn => {
    btn.addEventListener('click', () => setDashboardRange(btn.dataset.range));
  });

  $('clearDashboardStudentBtn').addEventListener('click', () => {
    dashboardStudentFilter = '';
    if (dashboardBaseResult) renderDashboardResult(dashboardBaseResult);
  });

  $('dashboardBackBtn').addEventListener('click', () => show('adminReportingScreen'));
  $('loadDashboardBtn').addEventListener('click', loadDashboard);

  $('openCsvBtn').addEventListener('click', () => {
    $('csvStart').value = daysAgoKey(29);
    $('csvEnd').value = todayKey();
    show('adminCsvScreen');
  });
  $('csvBackBtn').addEventListener('click', () => show('adminReportingScreen'));
  $('downloadCsvBtn').addEventListener('click', downloadCsv);

  $('openSheetBtn').addEventListener('click', openSheet);
  $('changePinNavBtn').addEventListener('click', () => {
    message('changePinMessage', '');
    show('adminChangePinScreen');
  });
  $('changePinBackBtn').addEventListener('click', () => show('adminSettingsScreen'));
  $('changePinBtn').addEventListener('click', changePin);
})();
