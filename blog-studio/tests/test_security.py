import unittest
from pathlib import Path
from app.services.security import validate_slug, contains_traversal, safe_join

class SecurityTests(unittest.TestCase):
    def test_slug_validation(self):
        self.assertTrue(validate_slug('valid-slug-123'))
        self.assertFalse(validate_slug('Invalid'))
        self.assertFalse(validate_slug('../bad'))

    def test_traversal_rejected(self):
        self.assertTrue(contains_traversal('../x'))
        self.assertTrue(contains_traversal('/abs/path'))
        self.assertTrue(contains_traversal('..%2fetc'))

    def test_safe_join_inside_root(self):
        root = Path('/tmp')
        p = safe_join(root, 'a/b')
        self.assertTrue(str(p).startswith('/tmp'))
        with self.assertRaises(ValueError):
            safe_join(root, '../etc/passwd')

    def test_git_default_disabled(self):
        cfg_text = Path('blog-studio/app/config.py').read_text(encoding='utf-8')
        self.assertIn("'enable_git_actions': False", cfg_text)

if __name__ == '__main__':
    unittest.main()
