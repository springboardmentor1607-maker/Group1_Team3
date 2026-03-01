import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const VolunteerListModal = ({
  complaint,
  volunteers,
  onClose,
  onAssignConfirm,
}) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            {selectedVolunteer && !showConfirm && (
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              {showConfirm
                ? "Confirm Assignment"
                : selectedVolunteer
                ? "Volunteer Details"
                : "Select Volunteer"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complaint info */}
        <div className="px-5 py-3 bg-muted/50 border-b border-border">
          <p className="text-xs text-muted-foreground">
            Assigning complaint
          </p>
          <p className="text-sm font-medium text-card-foreground">
            {complaint.title} — {complaint.id}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[50vh]">
          <AnimatePresence mode="wait">
            {/* Confirm Dialog */}
            {showConfirm && selectedVolunteer && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-heading text-lg">
                      {selectedVolunteer.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <p className="text-card-foreground font-medium mb-1">
                  Are you sure you want to assign this complaint to
                </p>
                <p className="text-primary font-heading font-semibold text-lg mb-6">
                  {selectedVolunteer.name}?
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="flex-1"
                    onClick={() =>
                      onAssignConfirm(complaint, selectedVolunteer)
                    }
                  >
                    Yes, Assign
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Volunteer Detail */}
            {selectedVolunteer && !showConfirm && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarFallback className="bg-primary text-primary-foreground font-heading text-2xl">
                      {selectedVolunteer.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-heading text-xl font-semibold text-card-foreground">
                    {selectedVolunteer.name}
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm text-card-foreground">
                        {selectedVolunteer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p className="text-sm text-card-foreground">
                        {selectedVolunteer.mobile}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm text-card-foreground">
                        {selectedVolunteer.location}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowConfirm(true)}
                >
                  Assign to {selectedVolunteer.name}
                </Button>
              </motion.div>
            )}

            {/* Volunteer List */}
            {!selectedVolunteer && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                {volunteers.map((vol) => (
                  <button
                    key={vol.id}
                    onClick={() => setSelectedVolunteer(vol)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left group"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-heading text-sm">
                        {vol.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">
                        {vol.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {vol.location}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VolunteerListModal;