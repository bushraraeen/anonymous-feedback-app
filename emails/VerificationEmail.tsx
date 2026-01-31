import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section style={{ backgroundColor: '#f6f9fc', padding: '20px' }}>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering with Mystery Message. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            letterSpacing: '4px', 
            textAlign: 'center',
            color: '#6100ff' 
          }}>
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        {/* Optional: Aap button bhi add kar sakte hain */}
        {/* <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{ color: '#fff', backgroundColor: '#000', padding: '10px 20px', borderRadius: '5px' }}
          >
            Verify Account
          </Button>
        </Row> */}
      </Section>
    </Html>
  );
}