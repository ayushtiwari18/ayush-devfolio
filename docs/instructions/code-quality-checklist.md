# Code Quality Checklist

## Before Every Commit

### Code Standards
- [ ] ESLint passes (zero warnings)
- [ ] No console.logs in production
- [ ] JSDoc comments on all functions
- [ ] Props validated
- [ ] No magic numbers
- [ ] Consistent naming conventions

### Component Quality
- [ ] Error boundaries exist
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Error states handled
- [ ] Mobile responsive
- [ ] Keyboard accessible

### Performance
- [ ] No unnecessary re-renders
- [ ] Images use next/image
- [ ] Lazy loading where appropriate
- [ ] Code splitting applied
- [ ] Bundle size checked

### Accessibility
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast passes (4.5:1)
- [ ] Screen reader tested

### SEO
- [ ] Metadata present
- [ ] Semantic HTML used
- [ ] Alt text on images
- [ ] Heading hierarchy correct
- [ ] No broken links

### Security
- [ ] No hardcoded secrets
- [ ] Input sanitized
- [ ] SQL injection prevented
- [ ] XSS protection
- [ ] CSRF tokens used

## Before Deployment
- [ ] All tests pass
- [ ] Lighthouse score > 90
- [ ] Cross-browser tested
- [ ] Mobile tested
- [ ] Production build successful