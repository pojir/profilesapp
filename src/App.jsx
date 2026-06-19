import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { fetchUserAttributes } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [signedInEmail, setSignedInEmail] = useState("");
  const { signOut, user } = useAuthenticator((context) => [
    context.signOut,
    context.user,
  ]);
  const profilesToDisplay = userprofiles.length
    ? userprofiles
    : [{ id: "signed-in-user", email: signedInEmail }];

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      const fallbackEmail = user?.signInDetails?.loginId ?? user?.username ?? "";

      if (!ignore) {
        setSignedInEmail(fallbackEmail);
      }

      try {
        const attributes = await fetchUserAttributes();

        if (!ignore) {
          setSignedInEmail(attributes.email ?? fallbackEmail);
        }
      } catch (error) {
        console.error("Unable to load user attributes", error);
      }

      try {
        const { data: profiles } = await client.models.UserProfile.list();

        if (!ignore) {
          setUserProfiles(profiles);
        }
      } catch (error) {
        console.error("Unable to load user profile", error);
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user?.signInDetails?.loginId, user?.username]);

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My Profile</Heading>

      <Divider />
      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {profilesToDisplay.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
