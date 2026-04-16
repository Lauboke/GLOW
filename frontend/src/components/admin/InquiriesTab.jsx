import React from "react";

const InquiriesTab = ({
  inquiries,
  replyInputs,
  setReplyInputs,
  handleSendReply,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {inquiries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            No new messages from the site.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inquiries.map((iq) => (
            <div
              key={iq._id}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black uppercase italic text-lg tracking-tighter text-gray-900">
                    {iq.name}
                  </h4>
                  <p className="text-pink-500 text-xs font-bold">{iq.email}</p>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">
                  {new Date(iq.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-6 rounded-2xl italic border border-gray-100 mb-4">
                "{iq.message}"
              </p>

              {iq.replied ? (
                <div className="mt-4 p-4 bg-pink-50 rounded-2xl border border-pink-100">
                  <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest block mb-2">
                    Your Reply:
                  </span>
                  <p className="text-sm text-gray-800">{iq.reply}</p>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  <textarea
                    placeholder="Type your reply to the client..."
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-pink-300 resize-none"
                    rows="3"
                    value={replyInputs[iq._id] || ""}
                    onChange={(e) =>
                      setReplyInputs({
                        ...replyInputs,
                        [iq._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleSendReply(iq._id)}
                    className="w-fit self-end bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 transition-all shadow-lg"
                  >
                    Send Email Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesTab;