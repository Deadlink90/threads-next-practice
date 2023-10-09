import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actionst";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
import { currentUser } from "@clerk/nextjs";


const ThreadDetails = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUser={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
      <Comment 
      threadId={thread.id}
      currentUserImg={userInfo.image}
      currentUserId={JSON.stringify(userInfo._id)}
      />
      </div>

      <div className="mt-10">
        {
          thread.children.map((childrenItem:any)=> (
            <ThreadCard
            key={childrenItem._id}
            id={childrenItem._id}
            currentUser={childrenItem?.id || ""}
            parentId={childrenItem.parentId}
            content={childrenItem.text}
            author={childrenItem.author}
            community={childrenItem.community}
            createdAt={childrenItem.createdAt}
            comments={childrenItem.children}
            isComment
          />
          ))
        }
      </div>
    </section>
  );
};

export default ThreadDetails;