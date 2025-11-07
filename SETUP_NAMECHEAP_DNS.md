# 🎯 Namecheap DNS Setup - Step-by-Step Guide

Your portfolio is **already deployed** to GitHub Pages! It's live at:
**https://mykolas-perevicius.github.io/perevici.us** ← Test this now!

Now we just need to point your **perevici.us** domain to GitHub Pages.

---

## ✅ Step 1: Log into Namecheap

1. Go to: **https://www.namecheap.com/myaccount/login/**
2. Enter your username and password
3. Click "Sign In"

---

## ✅ Step 2: Navigate to DNS Settings

1. After logging in, click **"Domain List"** in the left sidebar
2. Find **perevici.us** in your list
3. Click the **"Manage"** button next to perevici.us
4. Click on the **"Advanced DNS"** tab at the top

---

## ✅ Step 3: Delete Existing Records

You'll see some existing records (probably Namecheap parking). Delete them:

1. Look for any existing **A Records** or **CNAME Records** with Host `@` or `www`
2. Click the **trash icon** (🗑️) next to each one to delete
3. Confirm deletion

---

## ✅ Step 4: Add GitHub Pages A Records

Now add **4 new A Records** pointing to GitHub Pages:

### Record 1:
- **Type**: A Record
- **Host**: `@`
- **Value**: `185.199.108.153`
- **TTL**: Automatic

Click **"Add Record"** or the green checkmark ✓

### Record 2:
- **Type**: A Record
- **Host**: `@`
- **Value**: `185.199.109.153`
- **TTL**: Automatic

Click **"Add Record"** or the green checkmark ✓

### Record 3:
- **Type**: A Record
- **Host**: `@`
- **Value**: `185.199.110.153`
- **TTL**: Automatic

Click **"Add Record"** or the green checkmark ✓

### Record 4:
- **Type**: A Record
- **Host**: `@`
- **Value**: `185.199.111.153`
- **TTL**: Automatic

Click **"Add Record"** or the green checkmark ✓

---

## ✅ Step 5: (Optional) Add WWW Subdomain

If you want **www.perevici.us** to also work:

- **Type**: CNAME Record
- **Host**: `www`
- **Value**: `mykolas-perevicius.github.io`
- **TTL**: Automatic

Click **"Save All Changes"** at the bottom

---

## ✅ Step 6: Verify Your Settings

Your DNS settings should now look like this:

```
Type        Host    Value                      TTL
────────────────────────────────────────────────────
A Record    @       185.199.108.153           Automatic
A Record    @       185.199.109.153           Automatic
A Record    @       185.199.110.153           Automatic
A Record    @       185.199.111.153           Automatic
CNAME       www     mykolas-perevicius.github.io    Automatic
```

Click **"Save All Changes"** if you haven't already!

---

## ⏱️ Step 7: Wait for DNS Propagation

DNS changes take time to propagate across the internet:

- **Minimum**: 10-30 minutes
- **Average**: 2-4 hours
- **Maximum**: 24-48 hours (rare)

### Check DNS Propagation

**From Terminal** (I'll do this for you):
```bash
# Check if DNS has updated
dig perevici.us +short
```

**Online Tools** (you can check these now):
- https://dnschecker.org/#A/perevici.us
- https://www.whatsmydns.net/#A/perevici.us

---

## ✅ Step 8: Enable HTTPS on GitHub

Once DNS has propagated:

1. Go to: **https://github.com/mykolas-perevicius/perevici.us/settings/pages**
2. Wait for the green checkmark next to "Your site is published at http://perevici.us"
3. Check the box **"Enforce HTTPS"** (appears after domain is verified)
4. GitHub will automatically provision an SSL certificate

---

## 🎉 You're Done!

Once DNS propagates, your site will be live at:
- ✅ https://perevici.us
- ✅ https://www.perevici.us (if you added CNAME)
- ✅ https://mykolas-perevicius.github.io/perevici.us (always works)

---

## 🔍 Troubleshooting

### "Site not loading" after DNS setup?
```bash
# Check if DNS has propagated
dig perevici.us +short

# Expected output: The 4 GitHub IPs
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153
```

### "Your connection is not private" warning?
- This is normal during the first few hours
- GitHub is provisioning your SSL certificate
- Wait 5-10 minutes and try again
- Once ready, enable "Enforce HTTPS" in GitHub Pages settings

### Changes not showing?
- Hard refresh: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac)
- Clear browser cache
- Try in incognito/private mode
- Check https://mykolas-perevicius.github.io/perevici.us (always up-to-date)

---

## 📊 What I've Already Done

✅ Created complete portfolio with ALL features
✅ Set up GitHub repository at https://github.com/mykolas-perevicius/perevici.us
✅ Deployed to GitHub Pages
✅ Added CNAME file pointing to perevici.us
✅ Enabled GitHub Pages on the repo

**All that's left is the DNS setup above!**

---

## 🎨 What You'll Get

Your live portfolio includes:

**Interactive Features:**
- 🌙 Dark/light mode toggle
- ⌨️ Vim keyboard shortcuts (press `?` for help)
- 🖥️ Terminal overlay (press `` ` ``)
- 🎮 Konami Code easter egg (↑↑↓↓←→←→BA)
- 📊 Live GitHub stats via API
- 📜 Smooth scroll animations

**Sections:**
- Hero with animated typing
- Live GitHub stats
- Experience timeline
- Featured projects
- Skills grid
- Education
- Blog teaser
- Contact

---

## 📞 Need Help?

If you get stuck on any step, just let me know! I can:
- Walk you through each screen
- Check DNS propagation for you
- Troubleshoot any issues
- Make design/content updates

---

**Start with Step 1 and work your way down. Let me know when you're done or if you need help!** 🚀
