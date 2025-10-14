
---

## Setup & Deployment

### GitHub Pages Deployment

1. Fork or create a new repository on GitHub.
2. Upload all `.html` files to the root directory.
3. Upload `main.css` and `script.js` to the root directory.
4. Upload the `images` folder containing all assets.
5. Go to the repository **Settings > Pages**.
6. Select the branch (usually `main`) and root folder `/` as the source.
7. Save the settings and wait a few minutes for GitHub to publish.
8. Access your published website at `https://<username>.github.io/<repository-name>/`.

---

## Development Notes

- **CSS** is consolidated in `main.css` extracted from all original inline styles.
- **JavaScript** in `script.js` handles product rendering, filters, carts, forms, modals, and navigation toggles.
- Modal dialogs replace native alerts for better accessibility.
- The website is fully responsive and uses ARIA attributes to support screen readers.
- Navigation and footer are consistent across all pages.
- Image assets paths are relative and should remain in `/images` folder.

---

## Recommendations for Future Enhancements

- Integrate a backend or API for managing products, user authentication, and orders securely.
- Add payment gateway integration to the checkout process.
- Automate image optimization for faster loads.
- Use static site generators or frameworks (like React, Vue) for dynamic frontend features.
- Implement analytics, SEO optimizations, and performance monitoring.

---

## Support

For any issues or questions, please reach out to the project maintainer.

---

This README will guide you through deploying and maintaining your site smoothly.

If you want, I can package all files in a ZIP ready for upload or assist with automated deployment scripts next.

Would you like that?
