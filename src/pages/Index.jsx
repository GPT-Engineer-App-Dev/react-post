import { useState } from "react";
import { Container, VStack, HStack, Textarea, Button, Box, Text, IconButton, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { FaThumbsUp, FaHeart, FaLaugh } from "react-icons/fa";
import { usePosts, useAddPost, useAddReaction } from "../api/supabase";

const Index = () => {
  const [newPost, setNewPost] = useState("");
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const addPostMutation = useAddPost();
  const addReactionMutation = useAddReaction();

  const handlePost = () => {
    if (newPost.trim() !== "") {
      addPostMutation.mutate({ title: newPost, body: newPost });
      setNewPost("");
    }
  };

  const handleReaction = (postId, reaction) => {
    addReactionMutation.mutate({ post_id: postId, emoji: reaction });
  };

  if (postsLoading) return <Spinner />;
  if (postsError) return <Alert status="error"><AlertIcon />{postsError.message}</Alert>;

  return (
    <Container centerContent maxW="container.md" p={4}>
      <VStack spacing={4} width="100%">
        <Textarea
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Button onClick={handlePost} colorScheme="blue" width="100%" isLoading={addPostMutation.isLoading}>
          Post
        </Button>
        <VStack spacing={4} width="100%">
          {posts.map((post) => (
            <Box key={post.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
              <Text mb={2}>{post.body}</Text>
              <HStack spacing={4}>
                <HStack>
                  <IconButton
                    aria-label="Thumbs Up"
                    icon={<FaThumbsUp />}
                    onClick={() => handleReaction(post.id, "👍")}
                  />
                  <Text>{post.reactions?.filter(r => r.emoji === "👍").length || 0}</Text>
                </HStack>
                <HStack>
                  <IconButton
                    aria-label="Heart"
                    icon={<FaHeart />}
                    onClick={() => handleReaction(post.id, "❤️")}
                  />
                  <Text>{post.reactions?.filter(r => r.emoji === "❤️").length || 0}</Text>
                </HStack>
                <HStack>
                  <IconButton
                    aria-label="Laugh"
                    icon={<FaLaugh />}
                    onClick={() => handleReaction(post.id, "😂")}
                  />
                  <Text>{post.reactions?.filter(r => r.emoji === "😂").length || 0}</Text>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;