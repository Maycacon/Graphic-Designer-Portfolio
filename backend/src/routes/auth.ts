import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase.js';
import { AuthResponse } from '../types/index.js';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(400).json({ error: error?.message || 'Signup failed' });
    }

    const response: AuthResponse = {
      token: data.session.access_token,
      user: {
        id: data.user?.id || '',
        email: data.user?.email || '',
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const response: AuthResponse = {
      token: data.session.access_token,
      user: {
        id: data.user?.id || '',
        email: data.user?.email || '',
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
