# Media → Cloud → iPhone (begin method)

**Status: STARTED.** Project media in this repo is already copied into `cloud-media-pack/` (viewable from GitHub / Files on iPhone). Personal PC photos/videos must be copied from your **Mac** with the script below into **iCloud Drive**.

---

## What this cloud agent can and cannot do

| Can do here | Cannot do from this cloud agent |
|-------------|----------------------------------|
| Search this GitHub workspace (including hidden folders) | Access your personal Mac `~/Pictures`, Desktop, Photos Library |
| Copy logos / PDFs into `cloud-media-pack/` | Mount your local hard drive |
| Give you a Mac script + iPhone steps | Push private family photos into a public GitHub repo |

Your Mac is not attached to this Cursor Cloud session. **Run Step 2 on the Mac.**

---

## METHOD (do in order)

### Step 1 — Project pack already in cloud (done)

Copied into **`cloud-media-pack/`**:

| Folder | Contents |
|--------|----------|
| `images/` | Resync AI logos (PNG + SVG) |
| `documents/` | Daniel & Brooke complete PDF packages |
| `hidden-finds/` | Media found under hidden `.pdf-build/` |
| `videos/` | Empty (none in this repo yet) |

Inventory: [`inventories/WORKSPACE-INVENTORY.md`](inventories/WORKSPACE-INVENTORY.md)

**View on iPhone now (project files):**

1. Safari → open this repo on GitHub  
2. Tap **⋯** → **Download ZIP** → **Save to Files** → folder **Resync AI**  
3. Open **Files** → `cloud-media-pack` → `documents` or `images`

Or open PDFs directly (after merge to `main`):

- Daniel: `pdf-deliverables/daniel-noel-mcgarry/Resync-AI-Complete-Package-daniel-noel-mcgarry.pdf`
- Brooke: `pdf-deliverables/brooke-caroline-hunt/Resync-AI-Complete-Package-brooke-caroline-hunt.pdf`

---

### Step 2 — Personal images & videos (run on your Mac)

1. On the Mac, open **Terminal**.
2. Clone or open this repo folder, then:

```bash
cd /path/to/https-github.com-DannybrookeAI-dna-digital-guide
chmod +x scripts/mac-media-backup-to-icloud.sh

# Preview only (no copies)
./scripts/mac-media-backup-to-icloud.sh --dry-run

# Real copy → Desktop staging → iCloud Drive
./scripts/mac-media-backup-to-icloud.sh
```

3. The script:
   - Scans `Pictures`, `Movies`, `Desktop`, `Downloads`, `Documents`, then the rest of `$HOME`
   - **Includes hidden paths** (folders starting with `.`)
   - Skips system/caches/`node_modules`/`.git`
   - Copies images + videos into  
     `~/Desktop/Resync-Media-Staging/<timestamp>/`
   - Syncs that folder to  
     **iCloud Drive → `Resync-Media-Cloud/<timestamp>/`**

4. Wait for Finder to finish uploading (cloud icon clears).

---

### Step 3 — View on iPhone

1. Open **Files** → **Browse** → **iCloud Drive**
2. Open **Resync-Media-Cloud** → latest timestamp folder
3. Open **`images/`**, **`videos/`**, or **`hidden-source/`**
4. Tap a file to preview. Optional: **Share → Save Image / Save Video** into Photos

Also keep using [IPHONE-VIEW-AND-SAVE.md](IPHONE-VIEW-AND-SAVE.md) for the website + contracts ZIP method.

---

## Privacy

- **Do not** commit personal photos into this GitHub repo (size + privacy).
- Personal media stays in **your iCloud** (Apple ID: the account signed into the Mac/iPhone).
- Only project assets belong in `cloud-media-pack/`.

---

## Optional: Google Drive / Dropbox instead of iCloud

After the script finishes, drag  
`~/Desktop/Resync-Media-Staging/<timestamp>`  
into Google Drive or Dropbox in Finder, then open that app on iPhone.

---

## Checklist

- [x] Search workspace (incl. hidden) for images/videos/PDFs  
- [x] Copy project media → `cloud-media-pack/`  
- [x] Write inventory  
- [x] Add Mac backup script → iCloud  
- [ ] You run the script on the Mac (`--dry-run` first)  
- [ ] You open Files → iCloud Drive on iPhone  
