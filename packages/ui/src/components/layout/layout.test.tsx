import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { cn } from '../../lib/cn';
import { Box } from './Box';
import { Container } from './Container';
import { Flex } from './Flex';
import { Grid } from './Grid';
import { Section } from './Section';
import { HStack, Stack, VStack } from './Stack';

expect.extend(toHaveNoViolations);

describe('layout primitives', () => {
  it('Box renders a div and merges className', () => {
    render(<Box className="custom">box</Box>);
    const el = screen.getByText('box');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('custom');
  });

  it('Container applies the size preset', () => {
    render(<Container size="wide">wide</Container>);
    expect(screen.getByText('wide').className).toContain('max-w-[var(--layout-wide)]');
  });

  it('Flex and Grid render with their base classes', () => {
    render(
      <>
        <Flex>flex</Flex>
        <Grid>grid</Grid>
      </>,
    );
    expect(screen.getByText('flex').className).toContain('flex');
    expect(screen.getByText('grid').className).toContain('grid-cols-12');
  });

  it('Section renders a semantic section', () => {
    render(<Section>section</Section>);
    expect(screen.getByText('section').tagName).toBe('SECTION');
  });

  it('Stack, HStack, and VStack render with direction classes', () => {
    render(
      <>
        <Stack>stack</Stack>
        <HStack>hstack</HStack>
        <VStack>vstack</VStack>
      </>,
    );
    expect(screen.getByText('stack').className).toContain('flex-col');
    expect(screen.getByText('hstack').className).toContain('flex-row');
    expect(screen.getByText('vstack').className).toContain('items-center');
  });

  it('cn merges conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', undefined, 'text-blue-500')).toBe('text-blue-500');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Section>
        <Container>
          <Stack>
            <Box>content</Box>
          </Stack>
        </Container>
      </Section>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
