# Decision Validation Framework

## Before Making Any Code Decision

Answer these 8 questions:

### 1. Does this break existing functionality?
- [ ] Tested existing features
- [ ] No breaking changes
- [ ] Backward compatible

### 2. Is this the simplest solution?
- [ ] No over-engineering
- [ ] Follows KISS principle
- [ ] Easy to understand

### 3. Is this performant?
- [ ] Response time < 100ms
- [ ] Animations at 60fps
- [ ] No memory leaks

### 4. Is this accessible?
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] WCAG 2.1 AA compliant

### 5. Is this mobile-friendly?
- [ ] Responsive design
- [ ] Touch targets 44x44px
- [ ] Works offline (if needed)

### 6. Does this follow project patterns?
- [ ] Matches existing code style
- [ ] Uses established patterns
- [ ] Consistent with architecture

### 7. Is this testable?
- [ ] Can be unit tested
- [ ] Can be E2E tested
- [ ] Easy to mock dependencies

### 8. Is this maintainable long-term?
- [ ] Well documented
- [ ] No technical debt
- [ ] Future-proof

## Red Flags

STOP if you answer YES to any:
- Does this require new dependencies?
- Does this change database schema?
- Does this affect authentication?
- Does this break SEO?
- Does this reduce Lighthouse score?
- Does this ignore accessibility?
- Does this violate project standards?

## Approval Required

Seek clarification if:
- Major architectural change needed
- New technology introduction
- Breaking change to public API
- Performance trade-off required
- Security concern identified