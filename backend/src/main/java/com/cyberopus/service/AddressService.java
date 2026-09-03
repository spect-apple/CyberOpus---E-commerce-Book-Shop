package com.cyberopus.service;

import com.cyberopus.dto.request.AddressRequest;
import com.cyberopus.dto.response.AddressResponse;
import com.cyberopus.entity.Address;
import com.cyberopus.entity.User;
import com.cyberopus.exception.ForbiddenException;
import com.cyberopus.exception.ResourceNotFoundException;
import com.cyberopus.repository.AddressRepository;
import com.cyberopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AddressResponse> findAll(String email) {
        User user = getUser(email);
        return addressRepository.findByUserId(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse create(String email, AddressRequest request) {
        User user = getUser(email);
        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .line1(request.getLine1())
                .line2(request.getLine2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .isDefault(false)
                .build();

        // If this is the first address, make it default
        if (addressRepository.findByUserId(user.getId()).isEmpty()) {
            address.setIsDefault(true);
        }

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse update(Long id, String email, AddressRequest request) {
        User user = getUser(email);
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", id));

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public void delete(Long id, String email) {
        User user = getUser(email);
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", id));
        addressRepository.delete(address);
    }

    @Transactional
    public AddressResponse setDefault(Long id, String email) {
        User user = getUser(email);
        Address target = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", id));

        // Unset current default
        addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(current -> {
                    current.setIsDefault(false);
                    addressRepository.save(current);
                });

        target.setIsDefault(true);
        target = addressRepository.save(target);
        return mapToResponse(target);
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phoneNumber(address.getPhoneNumber())
                .line1(address.getLine1())
                .line2(address.getLine2())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .isDefault(address.getIsDefault())
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
